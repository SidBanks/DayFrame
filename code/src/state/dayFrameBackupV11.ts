import {
  migrateGoalPlanningAuthorityV1,
  validateGoalPlanningAuthority,
  type GoalPlanningAuthorityV2,
} from "../core/planning/goalDemand.js";
import {
  validateProposalAuthority,
  type AcceptedAllocationV1,
  type ProposalAuthorityV1,
} from "../core/planning/proposal.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV10, type DayFrameBackupV10Data } from "./dayFrameBackupV10.js";

export type DayFrameBackupV11Data = Omit<DayFrameBackupV10Data, "goalPlanning" | "proposals"> & {
  goalPlanning: GoalPlanningAuthorityV2;
  proposals: ProposalAuthorityV1;
};
export type DayFrameBackupV11 = {
  app: "DayFrame";
  surface: "backup";
  version: 11;
  exportedAt: string;
  data: DayFrameBackupV11Data;
};

export function createDayFrameBackupV11(data: DayFrameBackupV11Data, exportedAt: string) {
  return validateDayFrameBackupV11({
    app: "DayFrame",
    surface: "backup",
    version: 11,
    exportedAt,
    data,
  });
}

export function validateDayFrameBackupV11(value: unknown): DayFrameBackupV11 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 11 ||
    typeof value.exportedAt !== "string" ||
    !record(value.data) ||
    !("goalPlanning" in value.data) ||
    !("proposals" in value.data)
  )
    throw new RangeError("Backup V11 envelope is invalid.");
  const { goalPlanning, proposals, ...legacyData } = value.data;
  const planning = validateGoalPlanningAuthority(goalPlanning);
  const proposal = validateProposalAuthority(proposals);
  if (planning.status === "invalid")
    throw new RangeError("Backup V11 Goal planning authority is invalid.");
  if (proposal.status === "invalid")
    throw new RangeError("Backup V11 Proposal authority is invalid.");
  const legacy = validateDayFrameBackupV10({
    ...value,
    version: 10,
    data: {
      ...legacyData,
      goalPlanning: {
        version: 1,
        demands: planning.authority.demands,
        priorities: planning.authority.priorities,
      },
      proposals: proposal.authority,
    },
  });
  const checkedWithGoals = validateGoalPlanningAuthority(
    planning.authority,
    legacy.data.goals.goals,
  );
  if (checkedWithGoals.status === "invalid")
    throw new RangeError("Backup V11 Goal planning references are invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 11,
    exportedAt: legacy.exportedAt,
    data: {
      ...legacy.data,
      goalPlanning: checkedWithGoals.authority,
      proposals: proposal.authority,
    },
  };
}

export function translateBackupV10ToV11(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV10(value);
  return createDayFrameBackupV11(
    {
      ...backup.data,
      goalPlanning: migrateGoalPlanningAuthorityV1(backup.data.goalPlanning),
      proposals: {
        ...backup.data.proposals,
        acceptedAllocations: backup.data.proposals.acceptedAllocations.map((accepted) =>
          accepted.version === 1
            ? ({
                ...accepted,
                footprintCompleteness: "legacyProductiveOnly",
              } satisfies AcceptedAllocationV1)
            : accepted,
        ),
      },
    },
    exportedAt ?? backup.exportedAt,
  );
}

export function backupV11SemanticFingerprint(value: DayFrameBackupV11 | DayFrameBackupV11Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV11(value).data
      : createDayFrameBackupV11(value, "1970-01-01T00:00:00.000Z").data,
  );
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
