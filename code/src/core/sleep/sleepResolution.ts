import type { SleepOccurrenceReferenceV1 } from "../occurrences/sleepOccurrenceReference.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { SleepWindowIntentV1 } from "./sleepRequirement.js";
import type { FoundationalOccupancyV1 } from "../time/physicalOccupancy.js";

export type SleepOwnerRange = {
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
};
export type SleepInterval = { startsAt: string; endsAt: string };
export type SleepDerivationContextV1 = {
  version: 1;
  ownerWindow: SleepInterval;
  dayBoundaryStartTime: string;
  nextDayBoundaryStartTime: string;
  weekStartsOn: string;
  work: Array<{ reference: DurableOccurrenceReference; interval: SleepInterval }>;
  anchor?: { reference: DurableOccurrenceReference; interval: SleepInterval };
  offDay: boolean;
  windowProvenance: "clock" | "beforeWork" | "afterWork" | "offDay";
  physicalWindow: SleepInterval;
  preferredSleepStart: string;
  timezone: string;
  offsetMinutes: [number, number];
  clockPolicy: "localDate-compatible-earlier-fold-forward-gap";
};
export type SleepOccurrenceV1 = {
  version: 1;
  reference: SleepOccurrenceReferenceV1;
  requirementRevision: number;
  ownerDay: LocalDateString;
  membership: "requested" | "guard";
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  windowIntent: SleepWindowIntentV1;
  derivationContext: SleepDerivationContextV1;
};
export type SleepPhysicalCandidateV1 = {
  sleepStart: string;
  sleepEnd: string;
  footprintStart: string;
  footprintEnd: string;
};
export type ScheduledSleepOccurrenceV1 = SleepOccurrenceV1 &
  SleepPhysicalCandidateV1 & {
    provenance: { policy: "sleep-minute-joint-v1"; dependencyFingerprint: string };
  };
export type SleepFeasibilityConflictV1 = {
  category: "emptyPhysicalDomain" | "blockedPhysicalDomain" | "jointExhaustion";
  affected: Array<
    Pick<SleepOccurrenceV1, "reference" | "ownerDay" | "requirementRevision" | "membership"> & {
      physicalWindow: SleepInterval;
      requiredFootprintMinutes: number;
    }
  >;
  blockers: FoundationalOccupancyV1[];
  proofScope: SleepOwnerRange;
  dependencyFingerprint: string;
};
export type SleepSearchDiagnosticsV1 = {
  budgetLimit: number;
  budgetConsumed: number;
  candidateStartsExamined: number;
  candidateCount: number;
  searchNodes: number;
  requiredOccurrenceCount: number;
  phase: "candidates" | "jointSearch" | "complete";
};
export type SleepResolutionBaseV1 = {
  version: 1;
  ownerRange: SleepOwnerRange;
  requiredOccurrences: SleepOccurrenceV1[];
  dependencyFingerprint: string;
  physicalContext: SleepInterval;
  search: SleepSearchDiagnosticsV1;
};
export type SleepResolutionV1 = import("./sleepPlacementAuthority.js").SleepPlacementEvidenceV1 &
  (
    | (SleepResolutionBaseV1 & { status: "notConfigured" | "notApplicable" })
    | (SleepResolutionBaseV1 & { status: "satisfied"; occurrences: ScheduledSleepOccurrenceV1[] })
    | (SleepResolutionBaseV1 & { status: "infeasible"; conflicts: SleepFeasibilityConflictV1[] })
    | (SleepResolutionBaseV1 & {
        status: "searchIncomplete";
        reason: "deterministicBudgetExhausted";
      })
    | {
        version: 1;
        status: "invalid" | "protected" | "contextIncomplete";
        reason: string;
        ownerRange: SleepOwnerRange;
      }
  );
