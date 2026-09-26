import type {
  ActiveDayFrameAuthoredSetup,
  ActiveBlockTemplate,
  ActiveBlockRecurrence,
} from "../../state/types.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";
import { validateSleepRequirement, type SleepRequirementV1 } from "./sleepRequirement.js";
import { isSourceIncarnationId } from "../authored/sourceIncarnation.js";

/** Lineage evidence in the authored aggregate; never an occupancy or scheduling input. */
export type LegacySleepConversionV1 = {
  version: 1;
  id: string;
  commandId: string;
  requestFingerprint: string;
  request: import("./legacySleepConversion.js").ConversionRequest;
  reviewFingerprint: string;
  source: { template: ActiveBlockTemplate; recurrence: ActiveBlockRecurrence };
  requirement: SleepRequirementV1;
  cutover: SleepRequirementV1["effectiveFrom"];
  convertedAt: string;
  explicitConfirmation: true;
  mappingFingerprint: string;
  requirementDeleted: boolean;
};
export function conversionMappingFingerprint(
  value: Omit<LegacySleepConversionV1, "mappingFingerprint" | "requirementDeleted">,
) {
  return capacityFingerprint(value);
}
export function validateLegacySleepConversions(
  setup: ActiveDayFrameAuthoredSetup,
): LegacySleepConversionV1[] {
  const values = setup.legacySleepConversions ?? [];
  if (!Array.isArray(values)) throw new RangeError("Invalid Sleep conversion lineage.");
  const ids = new Set<string>(),
    commands = new Set<string>(),
    sources = new Set<string>();
  for (const c of values) {
    if (
      !c ||
      c.version !== 1 ||
      !isSourceIncarnationId(c.id) ||
      !isSourceIncarnationId(c.commandId) ||
      ids.has(c.id) ||
      commands.has(c.commandId) ||
      c.explicitConfirmation !== true ||
      typeof c.requirementDeleted !== "boolean" ||
      typeof c.requestFingerprint !== "string" ||
      typeof c.reviewFingerprint !== "string" ||
      !c.source?.template ||
      !c.source.recurrence ||
      Object.keys(c).sort().join() !==
        [
          "version",
          "id",
          "commandId",
          "requestFingerprint",
          "request",
          "reviewFingerprint",
          "source",
          "requirement",
          "cutover",
          "convertedAt",
          "explicitConfirmation",
          "mappingFingerprint",
          "requirementDeleted",
        ]
          .sort()
          .join()
    )
      throw new RangeError("Invalid or unsupported Sleep conversion.");
    const requirement = validateSleepRequirement(c.requirement);
    const { mappingFingerprint: _mapping, requirementDeleted: _deleted, ...evidence } = c;
    void _mapping;
    void _deleted;
    if (
      c.requestFingerprint !== capacityFingerprint(c.request) ||
      c.mappingFingerprint !== conversionMappingFingerprint(evidence) ||
      requirement.revision !== 1 ||
      requirement.effectiveFrom !== c.cutover ||
      requirement.createdAt !== c.convertedAt ||
      !requirement.enabled ||
      requirement.id === c.source.template.id ||
      requirement.id === c.source.recurrence.id ||
      !isSourceIncarnationId(c.source.template.incarnationId) ||
      !isSourceIncarnationId(c.source.recurrence.incarnationId)
    )
      throw new RangeError("Broken Sleep conversion mapping.");
    const selected = c.request.selection;
    const original = c.source.recurrence;
    const template = c.source.template;
    if (
      c.request.cutover !== c.cutover ||
      selected.templateId !== template.id ||
      selected.templateIncarnationId !== template.incarnationId ||
      selected.recurrenceId !== original.id ||
      selected.recurrenceIncarnationId !== original.incarnationId ||
      original.blockTemplateId !== template.id ||
      !template.enabled ||
      !["daily", "specificWeekdays"].includes(original.frequency) ||
      requirement.updatedAt !== c.convertedAt ||
      requirement.durationMinutes !== template.durationMinutes ||
      requirement.bufferBeforeMinutes !== (template.bufferBeforeMinutes ?? 0) ||
      requirement.bufferAfterMinutes !== (template.bufferAfterMinutes ?? 0) ||
      capacityFingerprint(requirement.weekdays) !==
        capacityFingerprint(original.frequency === "daily" ? "all" : original.weekdays) ||
      requirement.effectiveUntilExclusive !==
        (original.endsOnDate ? addUserDayLabels(original.endsOnDate, 1) : undefined) ||
      (original.startsOnDate && c.cutover <= original.startsOnDate) ||
      (original.endsOnDate && c.cutover > original.endsOnDate)
    )
      throw new RangeError("Conversion does not preserve the selected recurrence semantics.");
    const t = setup.blockTemplates.find(
      (t) => t.id === c.source.template.id && t.incarnationId === c.source.template.incarnationId,
    );
    const r = setup.blockRecurrences.find(
      (r) =>
        r.id === c.source.recurrence.id && r.incarnationId === c.source.recurrence.incarnationId,
    );
    if (
      !t ||
      !r ||
      r.blockTemplateId !== t.id ||
      r.endsOnDate !== addUserDayLabels(c.cutover, -1) ||
      sources.has(r.incarnationId) ||
      capacityFingerprint({ ...r, endsOnDate: c.source.recurrence.endsOnDate }) !==
        capacityFingerprint({ ...c.source.recurrence, endsOnDate: c.source.recurrence.endsOnDate })
    )
      throw new RangeError("Converted legacy source or retirement mismatch.");
    const first = setup.sleepRequirements?.find(
      (r) =>
        r.id === requirement.id &&
        r.incarnationId === requirement.incarnationId &&
        r.revision === 1,
    );
    if (
      c.requirementDeleted
        ? !!first
        : !first || capacityFingerprint(first) !== capacityFingerprint(requirement)
    )
      throw new RangeError("Converted Sleep lifetime is missing or mismatched.");
    if (
      !c.requirementDeleted &&
      setup.sleepRequirements?.some(
        (rev) => rev.incarnationId === requirement.incarnationId && rev.effectiveFrom < c.cutover,
      )
    )
      throw new RangeError("Converted Sleep cannot precede its cutover.");
    ids.add(c.id);
    commands.add(c.commandId);
    sources.add(r.incarnationId);
  }
  return structuredClone(values);
}
