import { cloneActiveSetup, validateActiveV2, validateIncarnationGraph } from "./activeV2.js";
import { validateDayFrameAuthoredSetup } from "../core/authored/validateDayFrameAuthoredSetup.js";
import { validateSleepRequirements } from "../core/sleep/sleepRequirement.js";
import type { ActiveDayFrameAuthoredSetup } from "./types.js";

export type DayFrameActiveV3 = {
  app: "DayFrame";
  surface: "active";
  version: 3;
  data: ActiveDayFrameAuthoredSetup & {
    sleepRequirements: ReturnType<typeof validateSleepRequirements>;
  };
};
export function createActiveV3(data: ActiveDayFrameAuthoredSetup): DayFrameActiveV3 {
  if (
    data.legacySleepConversions !== undefined &&
    (!Array.isArray(data.legacySleepConversions) || data.legacySleepConversions.length)
  )
    throw new RangeError("Sleep conversion requires Active V4.");
  const sleepRequirements = validateSleepRequirements(
    data.sleepRequirements === undefined ? [] : data.sleepRequirements,
  );
  validateIncarnationGraph(data);
  if (validateDayFrameAuthoredSetup(data).status !== "valid")
    throw new RangeError("Invalid Active V3 authored state.");
  return {
    app: "DayFrame",
    surface: "active",
    version: 3,
    data: { ...cloneActiveSetup(data), sleepRequirements },
  };
}
export function validateActiveV3(value: unknown): DayFrameActiveV3 {
  if (
    !value ||
    typeof value !== "object" ||
    !("app" in value) ||
    value.app !== "DayFrame" ||
    !("surface" in value) ||
    value.surface !== "active" ||
    !("version" in value) ||
    value.version !== 3 ||
    !("data" in value) ||
    !value.data ||
    typeof value.data !== "object" ||
    !("sleepRequirements" in value.data)
  )
    throw new RangeError("Invalid or unsupported Active V3 envelope.");
  validateSleepRequirements(value.data.sleepRequirements);
  return createActiveV3(value.data as ActiveDayFrameAuthoredSetup);
}
export function translateActiveV2ToV3(value: unknown): DayFrameActiveV3 {
  const legacy = validateActiveV2(value);
  return createActiveV3({ ...legacy.data, sleepRequirements: [] });
}
export function readActiveV3(value: unknown): DayFrameActiveV3 {
  return value && typeof value === "object" && "version" in value && value.version === 2
    ? translateActiveV2ToV3(value)
    : validateActiveV3(value);
}
