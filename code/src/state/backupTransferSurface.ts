import { createCurrentActive } from "./activeV4.js";
import { validateDayFrameBackupV4 } from "./dayFrameBackupV4.js";
import { validateDayFrameBackupV5 } from "./dayFrameBackupV5.js";
import { validateDayFrameBackupV6 } from "./dayFrameBackupV6.js";
import { validateDayFrameBackupV7 } from "./dayFrameBackupV7.js";
import { validateMeasurementDefinitionAuthority } from "../core/measurement/measurementDefinition.js";
import { validateProgressObservationAuthority } from "../core/progressObservation/progressObservation.js";
import type {
  BackupV3ImportResult,
  BackupV4ImportResult,
  BackupV5ImportResult,
  BackupV6ImportResult,
  BackupV7ImportResult,
} from "./types.js";
import { createDayFrameProfilesStorageV3 } from "./dayFrameProfilesV3.js";
const recordCount = (value: import("../core/planning/proposal.js").ProposalAuthorityV1) =>
  value.proposals.length +
  value.candidates.length +
  value.decisions.length +
  value.acceptedAllocations.length;
import type {
  BackupV3ExportResult,
  BackupV4ExportResult,
  BackupV5ExportResult,
  BackupV6ExportResult,
  BackupV7ExportResult,
  BackupV8ExportResult,
  BackupV9ExportResult,
  BackupV10ExportResult,
  BackupV11ExportResult,
  BackupV12ExportResult,
} from "./types.js";
import {
  validateDayFrameBackupV3,
  createDayFrameBackupV3,
  backupV3SemanticFingerprint,
  DayFrameBackupV3ValidationError,
  profilesV2BackupData,
} from "./dayFrameBackupV3.js";
import { createDayFrameBackupV4, backupV4SemanticFingerprint } from "./dayFrameBackupV4.js";
import { createDayFrameBackupV5, backupV5SemanticFingerprint } from "./dayFrameBackupV5.js";
import { createDayFrameBackupV6, backupV6SemanticFingerprint } from "./dayFrameBackupV6.js";
import { createDayFrameBackupV7, backupV7SemanticFingerprint } from "./dayFrameBackupV7.js";
const loadBackupV8 = () => import("./dayFrameBackupV8.js");
const loadBackupV9 = () => import("./dayFrameBackupV9.js");
const loadBackupV10 = () => import("./dayFrameBackupV10.js");
const loadBackupV11 = () => import("./dayFrameBackupV11.js");
const loadBackupV12 = () => import("./dayFrameBackupV12.js");
import { createActiveV3 } from "./activeV3.js";
import { cloneSavedProfiles } from "./dayFrameProfiles.js";
export type BackupTransferContext = {
  executionRestorePayload(
    value: import("./executionHistorySurface.js").ExecutionHistoryEnvelopeV1,
  ): Promise<
    import("./dayFrameRestoreTranslation.js").RestoreDurablePayloadMap["executionHistory"]
  >;
  historicalRestorePayload(
    value: import("../core/historicalPlan/historicalPlan.js").PlanPublicationBatchV1[],
  ): Promise<import("./dayFrameRestoreTranslation.js").RestoreDurablePayloadMap["historicalPlan"]>;
  emptyGoalStructureAuthority(): import("../core/planning/goalStructure.js").GoalStructureAuthorityV1;
  emptyGoalPlanningAuthority(): import("../core/planning/goalDemand.js").GoalPlanningAuthorityV1;
  emptyCompositionAuthority(): import("../core/planning/commitmentComposition.js").CompositionAuthorityV1;
  emptyProposalAuthority(): import("../core/planning/proposal.js").ProposalAuthorityV1;

  readonly goalSurface: import("./goalSurface.js").GoalSurface;
  readonly measurementDefinitionSurface: import("./measurementDefinitionSurface.js").MeasurementDefinitionSurface;
  readonly progressObservationSurface: import("./progressObservationSurface.js").ProgressObservationSurface;
  readonly goalStructureSurface: import("./goalStructureSurface.js").GoalStructureSurface;
  readonly goalPlanningSurface: import("./goalPlanningSurface.js").GoalPlanningSurface;
  readonly compositionSurface: import("./compositionSurface.js").CompositionSurface;
  readonly proposalSurface: import("./proposalSurface.js").ProposalSurface;
  readonly realizationSurface: ReturnType<
    typeof import("./lazyRealizationSurface.js").createLazyRealizationSurface
  >;
  readonly planDecisionSurface: import("./planDecisionSurface.js").PlanDecisionSurface;
  readonly executionHistorySurface: import("./executionHistorySurface.js").ExecutionHistorySurface;
  readonly historicalPlanSurface: import("./historicalPlanSurface.js").HistoricalPlanSurface;
  readonly state: import("./types.js").DayFrameState;
  readonly readiness: import("./dayFrameReadiness.js").DayFrameReadiness;
  readonly restoreComposition:
    | import("./dayFrameRestoreComposition.js").DayFrameRestoreComposition
    | undefined;
  readonly authorityTransaction: import("./dayFrameRuntimeAuthority.js").DayFrameRuntimeAuthorityController;
  readonly activeLocalIngressStatus: import("./types.js").ActiveLocalIngressStatus;
  readonly profileIngressStatus: import("./types.js").ProfileIngressStatus;
  readonly quarantinedProfiles: unknown[];
  getActiveSetup(): import("./types.js").ActiveDayFrameAuthoredSetup;
  initializeRestoreComposition(): Promise<void>;
};

export function createBackupTransferSurface(ctx: BackupTransferContext) {
  async function exportBackupV3(
    exportedAt: string,
    allowGoals = false,
    allowMeasurementDefinitions = false,
  ): Promise<BackupV3ExportResult> {
    if (!allowGoals && ctx.goalSurface.listGoals().length)
      return {
        status: "exportFailure",
        reason: "Backup V3 cannot represent Goal authority; export Backup V4.",
      };
    if (
      !allowMeasurementDefinitions &&
      ctx.measurementDefinitionSurface.exportMeasurementDefinitionAuthority().definitions.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V3 cannot represent Measurement Definition authority; export Backup V5.",
      };
    if (ctx.readiness.status !== "ready") return { status: "initializing" };
    if (
      !ctx.restoreComposition ||
      ctx.authorityTransaction.getState().status !== "inactive" ||
      ctx.restoreComposition.coordinator.getStatus() !== "idle"
    )
      return { status: "restoreBusy" };
    if (ctx.activeLocalIngressStatus.status === "recoveryRequired")
      return { status: "protectedSurface", surface: "active" };
    if (ctx.profileIngressStatus.status === "recoveryRequired")
      return { status: "protectedSurface", surface: "profiles" };
    if (ctx.planDecisionSurface.getPlanDecisionIngressStatus().status === "recoveryRequired")
      return { status: "protectedSurface", surface: "planDecisions" };
    if (
      ctx.executionHistorySurface.getExecutionHistoryIngressStatus().status === "recoveryRequired"
    )
      return { status: "protectedSurface", surface: "executionHistory" };
    if (ctx.historicalPlanSurface.getStatus().status === "protected")
      return { status: "protectedSurface", surface: "historicalPlan" };
    try {
      const historical = await ctx.historicalPlanSurface.exportHistoricalPlan();
      if (historical.status !== "exported")
        return historical.status === "protected"
          ? { status: "protectedSurface", surface: "historicalPlan" }
          : { status: "exportFailure", reason: "historicalPlanUnavailable" };
      const backup = createDayFrameBackupV3(
        {
          active: { surfaceVersion: 2, data: ctx.getActiveSetup() },
          profiles: profilesV2BackupData(ctx.state.savedProfiles, ctx.quarantinedProfiles),
          planDecisions: {
            surfaceVersion: 1,
            decisions: ctx.planDecisionSurface.getPlanDecisions(),
            quarantinedDecisions: ctx.planDecisionSurface.getQuarantinedPlanDecisions(),
          },
          executionHistory: ctx.executionHistorySurface.exportExecutionHistoryEnvelope(),
          historicalPlan: { surfaceVersion: 1, batches: historical.batches },
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup: structuredClone(backup),
        semanticFingerprint: backupV3SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status:
          error instanceof DayFrameBackupV3ValidationError ? "validationFailure" : "exportFailure",
        reason: error instanceof Error ? error.message : "Backup V3 export failed.",
      };
    }
  }

  async function exportBackupV4(
    exportedAt: string,
    allowMeasurementDefinitions = false,
  ): Promise<BackupV4ExportResult> {
    if (
      !allowMeasurementDefinitions &&
      ctx.measurementDefinitionSurface.exportMeasurementDefinitionAuthority().definitions.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V4 cannot represent Measurement Definition authority; export Backup V5.",
      };
    const legacy = await exportBackupV3(exportedAt, true, true);
    if (legacy.status !== "exported") return legacy as BackupV4ExportResult;
    if (ctx.goalSurface.getGoalIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goals" } as BackupV4ExportResult;
    try {
      const backup = createDayFrameBackupV4(
        { ...legacy.backup.data, goals: ctx.goalSurface.exportAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV4SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V4 export failed.",
      };
    }
  }
  async function exportBackupV5(
    exportedAt: string,
    allowProgressObservations = false,
  ): Promise<BackupV5ExportResult> {
    if (
      !allowProgressObservations &&
      ctx.progressObservationSurface.exportProgressObservationAuthority().observations.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V5 cannot represent Progress Observation authority; export Backup V6.",
      };
    const legacy = await exportBackupV4(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (
      ctx.measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status ===
      "protected"
    )
      return { status: "protectedSurface", surface: "measurementDefinitions" };
    try {
      const backup = createDayFrameBackupV5(
        {
          ...legacy.backup.data,
          measurementDefinitions:
            ctx.measurementDefinitionSurface.exportMeasurementDefinitionAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV5SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V5 export failed.",
      };
    }
  }
  async function exportBackupV6(
    exportedAt: string,
    allowGoalStructure = false,
  ): Promise<BackupV6ExportResult> {
    const structure = ctx.goalStructureSurface.exportGoalStructureAuthority();
    if (!allowGoalStructure && (structure.relationships.length || structure.milestones.length))
      return {
        status: "exportFailure",
        reason: "Backup V6 cannot represent Goal Structure authority; export Backup V7.",
      };
    const legacy = await exportBackupV5(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (ctx.progressObservationSurface.getProgressObservationIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "progressObservations" };
    try {
      const backup = createDayFrameBackupV6(
        {
          ...legacy.backup.data,
          progressObservations: ctx.progressObservationSurface.exportProgressObservationAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV6SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V6 export failed.",
      };
    }
  }
  async function exportBackupV7(
    exportedAt: string,
    allowGoalPlanning = false,
  ): Promise<BackupV7ExportResult> {
    const planning = ctx.goalPlanningSurface.exportGoalPlanningAuthority();
    if (!allowGoalPlanning && (planning.demands.length || planning.priorities.length))
      return {
        status: "exportFailure",
        reason: "Backup V7 cannot represent Goal Demand/Priority authority; export Backup V8.",
      };
    const legacy = await exportBackupV6(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (ctx.goalStructureSurface.getGoalStructureIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goalStructure" };
    try {
      const backup = createDayFrameBackupV7(
        {
          ...legacy.backup.data,
          goalStructure: ctx.goalStructureSurface.exportGoalStructureAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV7SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V7 export failed.",
      };
    }
  }
  async function exportBackupV8(
    exportedAt: string,
    allowComposition = false,
    allowResourceFootprints = false,
  ): Promise<BackupV8ExportResult> {
    const { backupV8SemanticFingerprint, createDayFrameBackupV8 } = await loadBackupV8();
    const legacy = await exportBackupV7(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (ctx.goalPlanningSurface.getGoalPlanningIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goalPlanning" };
    const planning = ctx.goalPlanningSurface.exportGoalPlanningAuthority();
    if (
      !allowResourceFootprints &&
      (planning.footprintSpecifications.length || planning.footprintAssociations.length)
    )
      return { status: "exportFailure", reason: "V11" };
    if (
      !allowComposition &&
      (ctx.compositionSurface.exportCompositionAuthority().relationships.length ||
        ctx.compositionSurface.exportCompositionAuthority().decisions.length)
    )
      return {
        status: "exportFailure",
        reason: "V9",
      };
    try {
      const backup = createDayFrameBackupV8(
        {
          ...legacy.backup.data,
          goalPlanning: {
            version: 1,
            demands: planning.demands,
            priorities: planning.priorities,
          },
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV8SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V8 export failed.",
      };
    }
  }
  async function exportBackupV9(
    exportedAt: string,
    allowProposals = false,
    allowResourceFootprints = false,
  ): Promise<BackupV9ExportResult> {
    const { createDayFrameBackupV9, backupV9SemanticFingerprint } = await loadBackupV9();
    const legacy = await exportBackupV8(exportedAt, true, allowResourceFootprints);
    if (legacy.status !== "exported") return legacy;
    if (ctx.compositionSurface.getCompositionIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "composition" };
    if (!allowProposals && recordCount(ctx.proposalSurface.exportProposalAuthority()))
      return { status: "exportFailure", reason: "V10" };
    try {
      const backup = createDayFrameBackupV9(
        { ...legacy.backup.data, composition: ctx.compositionSurface.exportCompositionAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV9SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V9 export failed.",
      };
    }
  }
  async function exportBackupV10(
    exportedAt: string,
    allowResourceFootprints = false,
  ): Promise<BackupV10ExportResult> {
    await ctx.initializeRestoreComposition();
    const { createDayFrameBackupV10, backupV10SemanticFingerprint } = await loadBackupV10();
    const legacy = await exportBackupV9(exportedAt, true, allowResourceFootprints);
    if (legacy.status !== "exported") return legacy;
    if (ctx.proposalSurface.getProposalIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "proposals" };
    if (
      !allowResourceFootprints &&
      ctx.proposalSurface
        .exportProposalAuthority()
        .acceptedAllocations.some((accepted) => accepted.version === 2)
    )
      return { status: "exportFailure", reason: "V11" };
    try {
      const backup = createDayFrameBackupV10(
        { ...legacy.backup.data, proposals: ctx.proposalSurface.exportProposalAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV10SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V10 export failed.",
      };
    }
  }
  async function exportBackupV11(
    exportedAt: string,
    allowRealizations = false,
  ): Promise<BackupV11ExportResult> {
    await ctx.initializeRestoreComposition();
    const { createDayFrameBackupV11, backupV11SemanticFingerprint } = await loadBackupV11();
    const legacy = await exportBackupV10(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    try {
      if (!allowRealizations) {
        const { assertBackupV11DowngradeSafe } = await loadBackupV12();
        assertBackupV11DowngradeSafe(ctx.realizationSurface.exportRealizationAuthority());
      }
      const backup = createDayFrameBackupV11(
        {
          ...legacy.backup.data,
          goalPlanning: ctx.goalPlanningSurface.exportGoalPlanningAuthority(),
          proposals: ctx.proposalSurface.exportProposalAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV11SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V11 export failed.",
      };
    }
  }
  async function exportBackupV12(exportedAt: string): Promise<BackupV12ExportResult> {
    await ctx.initializeRestoreComposition();
    const { createDayFrameBackupV12, backupV12SemanticFingerprint } = await loadBackupV12();
    const legacy = await exportBackupV11(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (ctx.realizationSurface.getRealizationIngressStatus() === "protected")
      return { status: "protectedSurface", surface: "realizations" };
    try {
      const backup = createDayFrameBackupV12(
        {
          ...legacy.backup.data,
          realizations: ctx.realizationSurface.exportRealizationAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV12SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V12 export failed.",
      };
    }
  }
  async function exportBackupV14(
    exportedAt: string,
  ): Promise<import("./types.js").BackupV14ExportResult> {
    const { createDayFrameBackupV14, backupV14SemanticFingerprint } =
      await import("./dayFrameBackupV14.js");
    await ctx.initializeRestoreComposition();
    if (ctx.readiness.status !== "ready") return { status: "initializing" };
    if (
      !ctx.restoreComposition ||
      ctx.authorityTransaction.getState().status !== "inactive" ||
      ctx.restoreComposition.coordinator.getStatus() !== "idle"
    )
      return { status: "restoreBusy" };
    for (const participant of Object.values(ctx.restoreComposition.participants)) {
      const status = participant.getReadiness();
      if (status !== "ready")
        return {
          status: "exportFailure",
          reason: `Authority ${participant.id} is not ready: ${status}`,
        };
    }
    try {
      const historical = await ctx.historicalPlanSurface.exportHistoricalPlan();
      if (historical.status !== "exported")
        return { status: "exportFailure", reason: "Historical Plan unavailable." };
      // Recheck after asynchronous history read, before capturing synchronous authored authorities.
      if (
        ctx.authorityTransaction.getState().status !== "inactive" ||
        ctx.restoreComposition.coordinator.getStatus() !== "idle"
      )
        return { status: "restoreBusy" };
      const backup = createDayFrameBackupV14(
        {
          active: {
            surfaceVersion: createCurrentActive(ctx.getActiveSetup()).version,
            data: createCurrentActive(ctx.getActiveSetup()).data,
          },
          profiles: {
            surfaceVersion: 3,
            profiles: cloneSavedProfiles(ctx.state.savedProfiles).map((profile) => ({
              ...profile,
              data: { ...profile.data, sleepRequirements: profile.data.sleepRequirements ?? [] },
            })),
            quarantinedProfiles: structuredClone(ctx.quarantinedProfiles),
          },
          planDecisions: {
            surfaceVersion: 1,
            decisions: ctx.planDecisionSurface.getPlanDecisions(),
            quarantinedDecisions: ctx.planDecisionSurface.getQuarantinedPlanDecisions(),
          },
          executionHistory: ctx.executionHistorySurface.exportExecutionHistoryEnvelope(),
          historicalPlan: { surfaceVersion: 1, batches: historical.batches },
          goals: ctx.goalSurface.exportAuthority(),
          measurementDefinitions:
            ctx.measurementDefinitionSurface.exportMeasurementDefinitionAuthority(),
          progressObservations: ctx.progressObservationSurface.exportProgressObservationAuthority(),
          goalStructure: ctx.goalStructureSurface.exportGoalStructureAuthority(),
          goalPlanning: ctx.goalPlanningSurface.exportGoalPlanningAuthority(),
          composition: ctx.compositionSurface.exportCompositionAuthority(),
          proposals: ctx.proposalSurface.exportProposalAuthority(),
          realizations: ctx.realizationSurface.exportRealizationAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV14SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V14 export failed.",
      };
    }
  }
  async function exportBackupV13(
    exportedAt: string,
  ): Promise<import("./types.js").BackupV13ExportResult> {
    const { createDayFrameBackupV13, backupV13SemanticFingerprint } =
      await import("./dayFrameBackupV13.js");
    await ctx.initializeRestoreComposition();
    if (ctx.readiness.status !== "ready") return { status: "initializing" };
    if (
      !ctx.restoreComposition ||
      ctx.authorityTransaction.getState().status !== "inactive" ||
      ctx.restoreComposition.coordinator.getStatus() !== "idle"
    )
      return { status: "restoreBusy" };
    for (const participant of Object.values(ctx.restoreComposition.participants)) {
      const status = participant.getReadiness();
      if (status !== "ready")
        return {
          status: "exportFailure",
          reason: `Authority ${participant.id} is not ready: ${status}`,
        };
    }
    try {
      const historical = await ctx.historicalPlanSurface.exportHistoricalPlan();
      if (historical.status !== "exported")
        return { status: "exportFailure", reason: "Historical Plan unavailable." };
      // Recheck after asynchronous history read, before capturing synchronous authored authorities.
      if (
        ctx.authorityTransaction.getState().status !== "inactive" ||
        ctx.restoreComposition.coordinator.getStatus() !== "idle"
      )
        return { status: "restoreBusy" };
      const backup = createDayFrameBackupV13(
        {
          active: { surfaceVersion: 3, data: createActiveV3(ctx.getActiveSetup()).data },
          profiles: {
            surfaceVersion: 3,
            profiles: cloneSavedProfiles(ctx.state.savedProfiles).map((profile) => ({
              ...profile,
              data: { ...profile.data, sleepRequirements: profile.data.sleepRequirements ?? [] },
            })),
            quarantinedProfiles: structuredClone(ctx.quarantinedProfiles),
          },
          planDecisions: {
            surfaceVersion: 1,
            decisions: ctx.planDecisionSurface.getPlanDecisions(),
            quarantinedDecisions: ctx.planDecisionSurface.getQuarantinedPlanDecisions(),
          },
          executionHistory: ctx.executionHistorySurface.exportExecutionHistoryEnvelope(),
          historicalPlan: { surfaceVersion: 1, batches: historical.batches },
          goals: ctx.goalSurface.exportAuthority(),
          measurementDefinitions:
            ctx.measurementDefinitionSurface.exportMeasurementDefinitionAuthority(),
          progressObservations: ctx.progressObservationSurface.exportProgressObservationAuthority(),
          goalStructure: ctx.goalStructureSurface.exportGoalStructureAuthority(),
          goalPlanning: ctx.goalPlanningSurface.exportGoalPlanningAuthority(),
          composition: ctx.compositionSurface.exportCompositionAuthority(),
          proposals: ctx.proposalSurface.exportProposalAuthority(),
          realizations: ctx.realizationSurface.exportRealizationAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV13SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V13 export failed.",
      };
    }
  }
  async function importBackupV3(backupValue: unknown): Promise<BackupV3ImportResult> {
    if (!ctx.restoreComposition) return { status: "persistenceFailure" };
    if (ctx.readiness.status !== "ready") return { status: "initializing" };
    let backup;
    try {
      backup = validateDayFrameBackupV3(structuredClone(backupValue));
    } catch {
      return { status: "invalidBackup" };
    }
    const target = {
      active: createActiveV3(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV3(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await ctx.executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await ctx.historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: { version: 1 as const, goals: [] },
      measurementDefinitions: { version: 1 as const, definitions: [] },
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: ctx.emptyGoalStructureAuthority(),
      goalPlanning: ctx.emptyGoalPlanningAuthority(),
      composition: ctx.emptyCompositionAuthority(),
      proposals: ctx.emptyProposalAuthority(),
    };
    const result = await ctx.restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV3", semanticFingerprint: backupV3SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "stagingFailed") return { status: "stagingFailure" };
    if (result.status === "sourceChanged") return { status: "sourceChanged" };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "rollbackFailed" || result.status === "recoveryRequired")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function importBackupV4(value: unknown): Promise<BackupV4ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV4(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!ctx.restoreComposition) return { status: "persistenceFailure" };
    const target = {
      active: createActiveV3(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV3(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await ctx.executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await ctx.historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: { version: 1 as const, definitions: [] },
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: ctx.emptyGoalStructureAuthority(),
      goalPlanning: ctx.emptyGoalPlanningAuthority(),
      composition: ctx.emptyCompositionAuthority(),
      proposals: ctx.emptyProposalAuthority(),
    };
    const result = await ctx.restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV4", semanticFingerprint: backupV4SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function importBackupV5(value: unknown): Promise<BackupV5ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV5(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!ctx.restoreComposition) return { status: "persistenceFailure" };
    const goals = new Set(backup.data.goals.goals.map((goal) => goal.id));
    if (
      validateMeasurementDefinitionAuthority(backup.data.measurementDefinitions, (id) =>
        goals.has(id),
      ).status === "invalid"
    )
      return { status: "invalidBackup" };
    const target = {
      active: createActiveV3(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV3(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await ctx.executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await ctx.historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: ctx.emptyGoalStructureAuthority(),
      goalPlanning: ctx.emptyGoalPlanningAuthority(),
      composition: ctx.emptyCompositionAuthority(),
      proposals: ctx.emptyProposalAuthority(),
    };
    const result = await ctx.restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV5", semanticFingerprint: backupV5SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function importBackupV6(value: unknown): Promise<BackupV6ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV6(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!ctx.restoreComposition) return { status: "persistenceFailure" };
    const goals = new Set(backup.data.goals.goals.map((goal) => goal.id)),
      definitions = new Map(
        backup.data.measurementDefinitions.definitions.map((item) => [
          `${item.id}|${item.revision}`,
          item,
        ]),
      );
    if (
      validateProgressObservationAuthority(backup.data.progressObservations, {
        goalExists: (id) => goals.has(id),
        getDefinition: (id, revision) => definitions.get(`${id}|${revision}`),
      }).status === "invalid"
    )
      return { status: "invalidBackup" };
    const target = {
      active: createActiveV3(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV3(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await ctx.executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await ctx.historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: backup.data.progressObservations,
      goalStructure: ctx.emptyGoalStructureAuthority(),
      goalPlanning: ctx.emptyGoalPlanningAuthority(),
      composition: ctx.emptyCompositionAuthority(),
      proposals: ctx.emptyProposalAuthority(),
    };
    const result = await ctx.restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV6", semanticFingerprint: backupV6SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function importBackupV7(value: unknown): Promise<BackupV7ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV7(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!ctx.restoreComposition) return { status: "persistenceFailure" };
    const target = {
      active: createActiveV3(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV3(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await ctx.executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await ctx.historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: backup.data.progressObservations,
      goalStructure: backup.data.goalStructure,
      goalPlanning: ctx.emptyGoalPlanningAuthority(),
      composition: ctx.emptyCompositionAuthority(),
      proposals: ctx.emptyProposalAuthority(),
    };
    const result = await ctx.restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV7", semanticFingerprint: backupV7SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  return {
    importBackupV3,
    importBackupV4,
    importBackupV5,
    importBackupV6,
    importBackupV7,
    exportBackupV3,
    exportBackupV4,
    exportBackupV5,
    exportBackupV6,
    exportBackupV7,
    exportBackupV8,
    exportBackupV9,
    exportBackupV10,
    exportBackupV11,
    exportBackupV12,
    exportBackupV14,
    exportBackupV13,
  };
}
