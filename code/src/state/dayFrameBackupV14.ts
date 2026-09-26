import { validateDayFrameBackupV13, type DayFrameBackupV13Data } from "./dayFrameBackupV13.js";
import { createCurrentActive, readCurrentActive } from "./activeV4.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
export type DayFrameBackupV14Data = Omit<DayFrameBackupV13Data, "active"> & {
  active: { surfaceVersion: 3 | 4; data: DayFrameBackupV13Data["active"]["data"] };
};
export type DayFrameBackupV14 = {
  app: "DayFrame";
  surface: "backup";
  version: 14;
  exportedAt: string;
  data: DayFrameBackupV14Data;
};
export function createDayFrameBackupV14(
  data: DayFrameBackupV14Data,
  exportedAt: string,
): DayFrameBackupV14 {
  return validateDayFrameBackupV14({
    app: "DayFrame",
    surface: "backup",
    version: 14,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV14(value: unknown): DayFrameBackupV14 {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 14 ||
    !("data" in value)
  )
    throw new RangeError("Invalid Backup V14.");
  const data = value.data as DayFrameBackupV14Data;
  const active = readCurrentActive({
    app: "DayFrame",
    surface: "active",
    version: data.active?.surfaceVersion,
    data: data.active?.data,
  });
  const { legacySleepConversions: _conversions, ...base } = active.data;
  void _conversions;
  const legacy = validateDayFrameBackupV13({
    ...value,
    version: 13,
    data: { ...data, active: { surfaceVersion: 3, data: base } },
  });
  for (const conversion of active.data.legacySleepConversions ?? []) {
    const matches = (
      ref: import("../core/occurrences/durableOccurrenceReference.js").DurableOccurrenceReference,
    ) =>
      ref.sourceKind === "template" &&
      ref.template.id === conversion.source.template.id &&
      ref.template.incarnationId === conversion.source.template.incarnationId &&
      ref.recurrence.id === conversion.source.recurrence.id &&
      ref.recurrence.incarnationId === conversion.source.recurrence.incarnationId;
    if (
      legacy.data.realizations.facts.some(
        (f) =>
          f.userDayDate >= conversion.cutover &&
          f.lineage.source.kind === "compositionRelationship" &&
          [f.lineage.source.parent, f.lineage.source.child].some(
            (e) =>
              e.sourceId === conversion.source.template.id &&
              e.incarnationId === conversion.source.template.incarnationId,
          ),
      ) ||
      legacy.data.historicalPlan.batches.some((batch) =>
        batch.days.some(
          (day) =>
            day.userDayDate >= conversion.cutover &&
            day.occurrences.some((o) => matches(o.reference)),
        ),
      ) ||
      legacy.data.planDecisions.decisions.some(
        (d) =>
          matches(d.target) &&
          (d.target.sourceKind !== "template" ||
            d.target.coordinate.scopeKind !== "userDay" ||
            d.target.coordinate.userDayDate >= conversion.cutover ||
            (d.kind === "placeOccurrence" && d.payload.userDayDate >= conversion.cutover)),
      )
    )
      throw new RangeError("Conversion conflicts with retained future legacy authority.");
  }
  return {
    ...legacy,
    version: 14,
    data: {
      ...legacy.data,
      active: { surfaceVersion: active.version, data: createCurrentActive(active.data).data },
    },
  };
}
export function backupV14SemanticFingerprint(value: DayFrameBackupV14) {
  return semanticFingerprint(validateDayFrameBackupV14(value).data);
}
