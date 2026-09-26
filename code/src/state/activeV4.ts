import { createActiveV3, readActiveV3, type DayFrameActiveV3 } from "./activeV3.js";
import { validateLegacySleepConversions } from "../core/sleep/legacySleepConversionRecord.js";
import type { ActiveDayFrameAuthoredSetup } from "./types.js";
export type DayFrameActiveV4 = Omit<DayFrameActiveV3, "version"> & { version: 4 };
export type CurrentActiveEnvelope = DayFrameActiveV3 | DayFrameActiveV4;
export function createCurrentActive(data: ActiveDayFrameAuthoredSetup): CurrentActiveEnvelope {
  const conversions = validateLegacySleepConversions(data);
  const { legacySleepConversions: _lineage, ...base } = data;
  void _lineage;
  const legacy = createActiveV3(base);
  return conversions.length
    ? { ...legacy, version: 4, data: { ...legacy.data, legacySleepConversions: conversions } }
    : legacy;
}
export function readCurrentActive(value: unknown): CurrentActiveEnvelope {
  if (value && typeof value === "object" && "version" in value && value.version === 4) {
    if (
      !("app" in value) ||
      value.app !== "DayFrame" ||
      !("surface" in value) ||
      value.surface !== "active" ||
      !("data" in value)
    )
      throw new RangeError("Invalid Active V4.");
    const result = createCurrentActive(value.data as ActiveDayFrameAuthoredSetup);
    if (result.version !== 4) throw new RangeError("Active V4 conversion authority missing.");
    return result;
  }
  return readActiveV3(value);
}
