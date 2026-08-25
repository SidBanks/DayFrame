import { allocateReadableSourceId } from "../core/authored/allocateReadableSourceId.js";
import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import { cloneShiftCycles } from "../core/cycles/shiftCycleUtils.js";
import type { ShiftDefinition } from "../core/shifts/types.js";
import type {
  AuthoredSetupLifecycleTransaction,
  AuthoredSourceReference,
  DayFramePreviewRange,
  DayFrameSchedulingPreferences,
  DayFrameState,
} from "../state/types.js";

export type SetupDraftEntry = { template: BlockTemplate; recurrence: BlockRecurrence };
export type SetupDraftLifecycleProvenance = {
  created: AuthoredSourceReference[];
  deleted: AuthoredSourceReference[];
};
export type SetupDraft = {
  schedulingPreferences: DayFrameSchedulingPreferences;
  previewRange: DayFramePreviewRange;
  shiftDefinitions: ShiftDefinition[];
  shiftCycles: ShiftCycle[];
  templateEntries: SetupDraftEntry[];
  lifecycle: SetupDraftLifecycleProvenance;
};

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function buildSetupDraft(state: DayFrameState, timestamp: string): SetupDraft {
  const createdDefaultCycle =
    state.shiftCycles.length === 0 ? createDefaultCycle(state, timestamp) : null;
  const shiftCycles = createdDefaultCycle
    ? [createdDefaultCycle]
    : cloneShiftCycles(state.shiftCycles);
  const occupiedRecurrenceIds = state.blockRecurrences.map((source) => source.id);
  const templateEntries = state.blockTemplates.map((template) => {
    const recurrence =
      state.blockRecurrences.find((source) => source.blockTemplateId === template.id) ??
      createDefaultRecurrence(template.id, occupiedRecurrenceIds);
    occupiedRecurrenceIds.push(recurrence.id);
    return {
      template: {
        ...template,
        requiresWorkAnchor: template.requiresWorkAnchor ?? false,
        externalResources: [...template.externalResources],
      },
      recurrence: normalizeRecurrence(recurrence),
    };
  });
  const existingRecurrences = new Set(state.blockRecurrences.map((source) => source.id));

  return {
    schedulingPreferences: { ...state.schedulingPreferences },
    previewRange: { ...state.previewRange },
    shiftDefinitions: state.shiftDefinitions.map((source) => ({
      ...source,
      workDays: [...source.workDays],
    })),
    shiftCycles,
    templateEntries,
    lifecycle: {
      created: [
        ...(createdDefaultCycle ? cycleReferences(createdDefaultCycle) : []),
        ...templateEntries
          .filter((entry) => !existingRecurrences.has(entry.recurrence.id))
          .map((entry) => sourceReference("blockRecurrence", entry.recurrence.id)),
      ],
      deleted: [],
    },
  };
}

export function buildSetupLifecycleTransaction(
  draft: SetupDraft,
): AuthoredSetupLifecycleTransaction {
  const createdKeys = new Set(draft.lifecycle.created.map(referenceKey));
  const current = [
    ...draft.shiftDefinitions.map((source) => sourceReference("shiftDefinition", source.id)),
    ...draft.shiftCycles.flatMap(cycleReferences),
    ...draft.templateEntries.flatMap((entry) => [
      sourceReference("blockTemplate", entry.template.id),
      sourceReference("blockRecurrence", entry.recurrence.id),
    ]),
  ];
  return {
    operations: [
      ...draft.lifecycle.deleted.map((reference) => ({
        ...reference,
        operation: "delete" as const,
      })),
      ...draft.lifecycle.created.map((reference) => ({
        ...reference,
        operation: "create" as const,
      })),
      ...current
        .filter((reference) => !createdKeys.has(referenceKey(reference)))
        .map((reference) => ({ ...reference, operation: "update" as const })),
    ],
  };
}

export function createSetupDraftSourceReference(
  sourceKind: AuthoredSourceReference["sourceKind"],
  sourceId: string,
  parentSourceId?: string,
): AuthoredSourceReference {
  return { sourceKind, sourceId, ...(parentSourceId ? { parentSourceId } : {}) };
}

export function recordSetupDraftSourceCreated(
  draft: SetupDraft,
  reference: AuthoredSourceReference,
): SetupDraft {
  const existing = new Set(draft.lifecycle.created.map(referenceKey));
  return existing.has(referenceKey(reference))
    ? draft
    : {
        ...draft,
        lifecycle: { ...draft.lifecycle, created: [...draft.lifecycle.created, reference] },
      };
}

export function recordSetupDraftSourceDeleted(
  draft: SetupDraft,
  reference: AuthoredSourceReference,
): SetupDraft {
  const key = referenceKey(reference);
  const created = draft.lifecycle.created.filter((candidate) => referenceKey(candidate) !== key);
  const wasCreated = created.length !== draft.lifecycle.created.length;
  const deleted =
    wasCreated || draft.lifecycle.deleted.some((candidate) => referenceKey(candidate) === key)
      ? draft.lifecycle.deleted
      : [...draft.lifecycle.deleted, reference];
  return { ...draft, lifecycle: { created, deleted } };
}

const sourceReference = createSetupDraftSourceReference;
const referenceKey = (reference: AuthoredSourceReference) =>
  `${reference.sourceKind}:${reference.parentSourceId ?? ""}:${reference.sourceId}`;

function cycleReferences(cycle: ShiftCycle): AuthoredSourceReference[] {
  return [
    sourceReference("shiftCycle", cycle.id),
    ...cycle.segments.map((source) => sourceReference("shiftSegment", source.id, cycle.id)),
    ...(cycle.sequence ?? []).map((source) =>
      sourceReference("shiftSequenceEntry", source.id, cycle.id),
    ),
  ];
}

function createDefaultRecurrence(
  blockTemplateId: string,
  occupiedIds: Iterable<string>,
): BlockRecurrence {
  return {
    id: allocateReadableSourceId({
      prefix: "rec_",
      preferredId: `rec_${blockTemplateId}`,
      occupiedIds,
    }),
    blockTemplateId,
    frequency: "daily",
  };
}

function normalizeRecurrence(recurrence: BlockRecurrence): BlockRecurrence {
  const clone = {
    ...recurrence,
    ...(recurrence.weekdays ? { weekdays: [...recurrence.weekdays] } : {}),
  };
  return clone.frequency === "specificWeekdays" &&
    weekdays.every((day) => clone.weekdays?.includes(day))
    ? { id: clone.id, blockTemplateId: clone.blockTemplateId, frequency: "daily" }
    : clone;
}

function createDefaultCycle(state: DayFrameState, timestamp: string): ShiftCycle {
  const id = allocateReadableSourceId({
    prefix: "cycle_",
    occupiedIds: state.shiftCycles.map((source) => source.id),
    numericPadding: 3,
  });
  const shiftDefinitionId = state.shiftDefinitions[0]?.id;
  return {
    id,
    userId: state.shiftDefinitions[0]?.userId ?? "user_001",
    name: "Cycle 1",
    type: "fixedSegments",
    mode: "manualSegments",
    startsOnDate: "2026-05-01",
    endsOnDate: "2026-05-31",
    segments: shiftDefinitionId
      ? [
          {
            id: "segment_1",
            shiftCycleId: id,
            shiftDefinitionId,
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-01",
          },
        ]
      : [],
    sequence: [
      { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: shiftDefinitionId ?? null },
    ],
    sequenceAnchorDate: "2026-05-01",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
