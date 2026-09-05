import {
  emptyProposalAuthority,
  validateProposalAuthority,
  type ProposalAuthorityV1,
} from "../core/planning/proposal.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV9, type DayFrameBackupV9Data } from "./dayFrameBackupV9.js";

export type DayFrameBackupV10Data = DayFrameBackupV9Data & { proposals: ProposalAuthorityV1 };
export type DayFrameBackupV10 = {
  app: "DayFrame";
  surface: "backup";
  version: 10;
  exportedAt: string;
  data: DayFrameBackupV10Data;
};
export function createDayFrameBackupV10(data: DayFrameBackupV10Data, exportedAt: string) {
  return validateDayFrameBackupV10({
    app: "DayFrame",
    surface: "backup",
    version: 10,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV10(value: unknown): DayFrameBackupV10 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 10 ||
    typeof value.exportedAt !== "string" ||
    !record(value.data) ||
    !("proposals" in value.data)
  )
    throw new RangeError("Backup V10 envelope is invalid.");
  const { proposals, ...legacyData } = value.data;
  const legacy = validateDayFrameBackupV9({ ...value, version: 9, data: legacyData });
  const checked = validateProposalAuthority(proposals);
  if (checked.status === "invalid")
    throw new RangeError("Backup V10 Proposal authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 10,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, proposals: checked.authority },
  };
}
export function translateBackupV9ToV10(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV9(value);
  return createDayFrameBackupV10(
    { ...backup.data, proposals: emptyProposalAuthority() },
    exportedAt ?? backup.exportedAt,
  );
}
export function backupV10SemanticFingerprint(value: DayFrameBackupV10 | DayFrameBackupV10Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV10(value).data
      : createDayFrameBackupV10(value, "1970-01-01T00:00:00.000Z").data,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
