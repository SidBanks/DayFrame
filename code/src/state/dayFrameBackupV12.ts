import type { AcceptedAllocationV2 } from "../core/planning/proposal.js";
import {
  validateRealizationAuthority,
  type RealizationAuthorityV1,
} from "../core/planning/acceptedAllocationRealization.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV11, type DayFrameBackupV11Data } from "./dayFrameBackupV11.js";

export type DayFrameBackupV12Data = DayFrameBackupV11Data & {
  realizations: RealizationAuthorityV1;
};
export type DayFrameBackupV12 = {
  app: "DayFrame";
  surface: "backup";
  version: 12;
  exportedAt: string;
  data: DayFrameBackupV12Data;
};

export function createDayFrameBackupV12(data: DayFrameBackupV12Data, exportedAt: string) {
  return validateDayFrameBackupV12({
    app: "DayFrame",
    surface: "backup",
    version: 12,
    exportedAt,
    data,
  });
}

export function validateDayFrameBackupV12(value: unknown): DayFrameBackupV12 {
  if (
    !record(value) ||
    value.version !== 12 ||
    !record(value.data) ||
    !("realizations" in value.data)
  )
    throw new RangeError("Backup V12 envelope is invalid.");
  const { realizations, ...legacyData } = value.data;
  const legacy = validateDayFrameBackupV11({ ...value, version: 11, data: legacyData });
  const checked = validateRealizationAuthority(realizations);
  if (checked.status === "invalid")
    throw new RangeError("Backup V12 realization authority is invalid.");
  validateReferences(checked.authority, legacy.data.proposals.acceptedAllocations);
  return {
    app: "DayFrame",
    surface: "backup",
    version: 12,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, realizations: checked.authority },
  };
}

export function translateBackupV11ToV12(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV11(value);
  return createDayFrameBackupV12(
    { ...backup.data, realizations: { version: 1, realizations: [], facts: [] } },
    exportedAt ?? backup.exportedAt,
  );
}

export function backupV12SemanticFingerprint(value: DayFrameBackupV12 | DayFrameBackupV12Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV12(value).data
      : createDayFrameBackupV12(value, "1970-01-01T00:00:00.000Z").data,
  );
}

export function assertBackupV11DowngradeSafe(realizations: RealizationAuthorityV1) {
  if (realizations.realizations.length || realizations.facts.length)
    throw new RangeError("Backup V11 cannot preserve realized schedule authority; export V12.");
}

function validateReferences(
  authority: RealizationAuthorityV1,
  accepted: readonly (AcceptedAllocationV2 | { version: 1; id: string })[],
) {
  for (const realization of authority.realizations) {
    const source = accepted.find((item) => item.id === realization.acceptedAllocationId);
    if (!source || source.version !== 2)
      throw new RangeError(
        "Backup V12 realization references missing complete Accepted Allocation.",
      );
    const claimIds = new Set(source.claims.map((claim) => claim.id));
    if (!realization.acceptedClaimIds.every((id) => claimIds.has(id)))
      throw new RangeError("Backup V12 realization claim lineage is invalid.");
  }
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
