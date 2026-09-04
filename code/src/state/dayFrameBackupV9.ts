import {
  emptyCompositionAuthority,
  validateCompositionAuthority,
  type CompositionAuthorityV1,
  type CompositionTemplateSourceV1,
} from "../core/planning/commitmentComposition.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import { validateDayFrameBackupV8, type DayFrameBackupV8Data } from "./dayFrameBackupV8.js";

export type DayFrameBackupV9Data = DayFrameBackupV8Data & { composition: CompositionAuthorityV1 };
export type DayFrameBackupV9 = {
  app: "DayFrame";
  surface: "backup";
  version: 9;
  exportedAt: string;
  data: DayFrameBackupV9Data;
};
export function createDayFrameBackupV9(data: DayFrameBackupV9Data, exportedAt: string) {
  return validateDayFrameBackupV9({
    app: "DayFrame",
    surface: "backup",
    version: 9,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV9(value: unknown): DayFrameBackupV9 {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "backup" ||
    value.version !== 9 ||
    typeof value.exportedAt !== "string" ||
    !record(value.data) ||
    !("composition" in value.data)
  )
    throw new RangeError("Backup V9 envelope is invalid.");
  const { composition, ...legacyData } = value.data;
  const legacy = validateDayFrameBackupV8({ ...value, version: 8, data: legacyData });
  const sources: CompositionTemplateSourceV1[] = legacy.data.active.data.blockTemplates.map(
    (source) => ({
      kind: "template",
      sourceId: source.id,
      incarnationId: source.incarnationId,
      title: source.title,
      durationMinutes: source.durationMinutes,
      revisionToken: source.updatedAt,
      userId: source.userId,
      category: source.category,
      priority: source.priority,
    }),
  );
  const checked = validateCompositionAuthority(composition, sources);
  if (checked.status === "invalid")
    throw new RangeError("Backup V9 Composition authority is invalid.");
  return {
    app: "DayFrame",
    surface: "backup",
    version: 9,
    exportedAt: legacy.exportedAt,
    data: { ...legacy.data, composition: checked.authority },
  };
}
export function translateBackupV8ToV9(value: unknown, exportedAt?: string) {
  const backup = validateDayFrameBackupV8(value);
  return createDayFrameBackupV9(
    { ...backup.data, composition: emptyCompositionAuthority() },
    exportedAt ?? backup.exportedAt,
  );
}
export function backupV9SemanticFingerprint(value: DayFrameBackupV9 | DayFrameBackupV9Data) {
  return semanticFingerprint(
    "data" in value
      ? validateDayFrameBackupV9(value).data
      : createDayFrameBackupV9(value, "1970-01-01T00:00:00.000Z").data,
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
