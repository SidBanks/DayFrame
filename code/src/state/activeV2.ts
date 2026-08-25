import {
  isSourceIncarnationId,
  type IncarnatedSource,
  type SourceIncarnationAllocator,
} from "../core/authored/sourceIncarnation.js";
import type { ActiveDayFrameAuthoredSetup, DayFrameAuthoredPattern } from "./types.js";
import { validateDayFrameAuthoredSetup } from "../core/authored/validateDayFrameAuthoredSetup.js";

export const DAYFRAME_ACTIVE_V2_VERSION = 2 as const;

export type DayFrameActiveV2 = {
  app: "DayFrame";
  surface: "active";
  version: typeof DAYFRAME_ACTIVE_V2_VERSION;
  data: ActiveDayFrameAuthoredSetup;
};

export function instantiateActiveSetup(
  pattern: DayFrameAuthoredPattern,
  allocate: SourceIncarnationAllocator,
): ActiveDayFrameAuthoredSetup {
  const active: ActiveDayFrameAuthoredSetup = {
    schedulingPreferences: { ...pattern.schedulingPreferences },
    previewRange: { ...pattern.previewRange },
    shiftDefinitions: pattern.shiftDefinitions.map((source) => incarnate(source, allocate)),
    shiftCycles: pattern.shiftCycles.map((cycle) => ({
      ...cycle,
      incarnationId: allocated(allocate),
      segments: cycle.segments.map((source) => incarnate(source, allocate)),
      sequence: (cycle.sequence ?? []).map((source) => incarnate(source, allocate)),
    })),
    blockTemplates: pattern.blockTemplates.map((source) => incarnate(source, allocate)),
    blockRecurrences: pattern.blockRecurrences.map((source) => incarnate(source, allocate)),
    manualEvents: pattern.manualEvents.map((source) => incarnate(source, allocate)),
  };
  validateIncarnationGraph(active);
  return active;
}

export function createActiveV2(data: ActiveDayFrameAuthoredSetup): DayFrameActiveV2 {
  return { app: "DayFrame", surface: "active", version: DAYFRAME_ACTIVE_V2_VERSION, data };
}

export function validateActiveV2(value: unknown): DayFrameActiveV2 {
  if (!isRecord(value) || value.app !== "DayFrame" || value.surface !== "active") {
    throw new RangeError("Active V2 envelope is invalid.");
  }
  if (value.version !== DAYFRAME_ACTIVE_V2_VERSION) {
    throw new RangeError("Active format version is unsupported.");
  }
  if (!isRecord(value.data)) {
    throw new RangeError("Active V2 data is missing.");
  }

  const data = value.data as unknown as ActiveDayFrameAuthoredSetup;
  validateIncarnationGraph(data);
  const validation = validateDayFrameAuthoredSetup(data);
  if (validation.status === "invalid") {
    throw new RangeError("Active V2 authored data is invalid.");
  }
  return createActiveV2(cloneActiveSetup(data));
}

export function cloneActiveSetup(data: ActiveDayFrameAuthoredSetup): ActiveDayFrameAuthoredSetup {
  return {
    schedulingPreferences: { ...data.schedulingPreferences },
    previewRange: { ...data.previewRange },
    shiftDefinitions: data.shiftDefinitions.map((source) => ({
      ...source,
      workDays: [...source.workDays],
    })),
    shiftCycles: data.shiftCycles.map((cycle) => ({
      ...cycle,
      segments: cycle.segments.map((source) => ({
        ...source,
        ...(source.schedulePreferences
          ? { schedulePreferences: { ...source.schedulePreferences } }
          : {}),
      })),
      sequence: (cycle.sequence ?? []).map((source) => ({ ...source })),
    })),
    blockTemplates: data.blockTemplates.map((source) => ({
      ...source,
      externalResources: source.externalResources.map((resource) => ({
        ...resource,
        ...(resource.metadata ? { metadata: { ...resource.metadata } } : {}),
      })),
    })),
    blockRecurrences: data.blockRecurrences.map((source) => ({
      ...source,
      ...(source.weekdays ? { weekdays: [...source.weekdays] } : {}),
    })),
    manualEvents: data.manualEvents.map((source) => ({ ...source })),
  };
}

export function projectActiveToPattern(data: ActiveDayFrameAuthoredSetup): DayFrameAuthoredPattern {
  return {
    schedulingPreferences: { ...data.schedulingPreferences },
    previewRange: { ...data.previewRange },
    shiftDefinitions: data.shiftDefinitions.map(stripIncarnation),
    shiftCycles: data.shiftCycles.map((cycle) => ({
      ...stripIncarnation(cycle),
      segments: cycle.segments.map(stripIncarnation),
      sequence: (cycle.sequence ?? []).map(stripIncarnation),
    })),
    blockTemplates: data.blockTemplates.map(stripIncarnation),
    blockRecurrences: data.blockRecurrences.map(stripIncarnation),
    manualEvents: data.manualEvents.map(stripIncarnation),
  };
}

export function validateIncarnationGraph(data: ActiveDayFrameAuthoredSetup): void {
  const sources: Array<{ incarnationId?: unknown }> = [
    ...data.shiftDefinitions,
    ...data.shiftCycles,
    ...data.shiftCycles.flatMap((cycle) => [...cycle.segments, ...(cycle.sequence ?? [])]),
    ...data.blockTemplates,
    ...data.blockRecurrences,
    ...data.manualEvents,
  ];
  const seen = new Set<string>();
  for (const source of sources) {
    if (!isSourceIncarnationId(source.incarnationId)) {
      throw new RangeError("Active source incarnation must be a canonical UUID v4.");
    }
    if (seen.has(source.incarnationId)) {
      throw new RangeError("Active source incarnations must be globally unique.");
    }
    seen.add(source.incarnationId);
  }
}

function incarnate<T extends object>(
  source: T,
  allocate: SourceIncarnationAllocator,
): T & IncarnatedSource {
  return { ...source, incarnationId: allocated(allocate) };
}

function allocated(allocate: SourceIncarnationAllocator) {
  const id = allocate();
  if (!isSourceIncarnationId(id))
    throw new RangeError("Source incarnation allocator returned a non-canonical UUID v4.");
  return id;
}

function stripIncarnation<T extends object & { incarnationId?: unknown }>(
  source: T,
): Omit<T, "incarnationId"> {
  const pattern = { ...source };
  delete pattern.incarnationId;
  return pattern;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
