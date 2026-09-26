import type { SleepResolutionV1 } from "../sleep/sleepResolution.js";
import type { SleepOccurrenceReferenceV1 } from "../occurrences/sleepOccurrenceReference.js";

/** Derived protection only: never an accepted, realized or published subject. */
export type SleepProtectionV1 = {
  id: string;
  sourceFamily: "requiredSleep";
  part: "activity" | "beforeBuffer" | "afterBuffer";
  kind: "occupied" | "buffer";
  startsAt: string;
  endsAt: string;
  reference: SleepOccurrenceReferenceV1;
  dependencyFingerprint: string;
};
export type FoundationalPlanningQualificationV1 = {
  status: "allocatable" | "nonAllocatable";
  sleep: SleepResolutionV1;
  protection: SleepProtectionV1[];
};

/** The sole adapter of the solved witness. Never protects the authored flexibility domain. */
export function qualifyFoundationalPlanning(
  sleep: SleepResolutionV1,
): FoundationalPlanningQualificationV1 {
  const protection: SleepProtectionV1[] = [];
  if (sleep.status === "satisfied") {
    for (const occurrence of sleep.occurrences) {
      const pieces = [
        ["beforeBuffer", occurrence.footprintStart, occurrence.sleepStart],
        ["activity", occurrence.sleepStart, occurrence.sleepEnd],
        ["afterBuffer", occurrence.sleepEnd, occurrence.footprintEnd],
      ] as const;
      for (const [part, startsAt, endsAt] of pieces) {
        if (startsAt === endsAt) continue;
        protection.push({
          id: `requiredSleep:${JSON.stringify(occurrence.reference)}:${part}`,
          sourceFamily: "requiredSleep",
          part,
          kind: part === "activity" ? "occupied" : "buffer",
          startsAt,
          endsAt,
          reference: structuredClone(occurrence.reference),
          dependencyFingerprint: sleep.dependencyFingerprint,
        });
      }
    }
  }
  return {
    status: ["satisfied", "notConfigured", "notApplicable"].includes(sleep.status)
      ? "allocatable"
      : "nonAllocatable",
    sleep: structuredClone(sleep),
    protection,
  };
}
