import { describe, expect, it } from "vitest";
import type { CapacityResultV1 } from "./capacity.js";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import {
  projectDemandResourceFootprint,
  resolveDemandFootprintAssociation,
  validateDemandResourceAuthority,
  type DemandResourceFootprintAssociationV1,
  type DemandResourceFootprintSpecV1,
} from "./demandResourceFootprint.js";

const authored = {
  version: 1 as const,
  role: "authoredAuthority" as const,
  origin: { kind: "directAuthoring" as const },
};
const spec: DemandResourceFootprintSpecV1 = {
  recordType: "demandResourceFootprintSpec",
  version: 1,
  id: "footprint-spec" as never,
  revision: 1 as never,
  status: "active",
  name: "Prepared focus session",
  variants: [
    {
      id: "standard",
      name: "Standard",
      components: [
        {
          id: "setup",
          role: "supportActivity",
          scope: "perSession",
          requiredness: "required",
          durationMinutes: 30,
          geometry: { kind: "endsAtProductiveStart" },
          actor: "user",
          source: {
            kind: "compositionRelationship",
            relationshipId: "relationship" as never,
            relationshipRevision: 1 as never,
            parent: { sourceId: "focus", incarnationId: "focus-1" },
            child: { sourceId: "setup", incarnationId: "setup-1" },
            slot: "before",
            semanticsFingerprint: "composition-semantics",
          },
        },
        {
          id: "recovery",
          role: "bufferProtection",
          scope: "perSession",
          requiredness: "required",
          target: { kind: "productive" },
          side: "after",
          durationMinutes: 15,
          source: { kind: "direct" },
        },
        {
          id: "optional-review",
          role: "supportActivity",
          scope: "perSession",
          requiredness: "optional",
          durationMinutes: 15,
          geometry: {
            kind: "offsetFromProductiveEnd",
            anchor: "componentStart",
            offsetMinutes: 15,
          },
          actor: "user",
          source: { kind: "direct" },
        },
      ],
    },
  ],
  createdAt: "2026-09-04T12:00:00.000Z",
  updatedAt: "2026-09-04T12:00:00.000Z",
  provenance: authored,
};
const association: DemandResourceFootprintAssociationV1 = {
  recordType: "demandResourceFootprintAssociation",
  version: 1,
  id: "association" as never,
  revision: 1 as never,
  demandId: "demand" as never,
  status: "active",
  selection: {
    kind: "specification",
    specificationId: spec.id,
    specificationRevision: spec.revision,
    variantId: "standard",
    selectedOptionalComponentIds: [],
  },
  createdAt: "2026-09-04T12:00:00.000Z",
  updatedAt: "2026-09-04T12:00:00.000Z",
  provenance: authored,
};
const demand = {
  semanticId: "projection",
  demandId: association.demandId,
  demandRevision: 1,
  goalId: "goal" as never,
  goalRevision: 1,
} as unknown as DemandProjectionV1;
const capacity = {
  fingerprint: "capacity",
  intervals: [
    {
      id: "opening",
      startsAt: "2026-09-04T14:00:00.000Z",
      endsAt: "2026-09-04T18:00:00.000Z",
      allocability: "allocatable",
    },
  ],
} as CapacityResultV1;
const resolver = {
  shiftCycles: [],
  defaultSchedulingPreferences: {
    dayBoundaryStartTime: "00:00" as const,
    weekStartsOn: "monday" as const,
  },
};

describe("Demand Resource Footprint V1", () => {
  it("resolves authored requiredness and projects exact productive/support/Buffer lineage", () => {
    expect(
      validateDemandResourceAuthority({
        specifications: [spec],
        associations: [association],
        demandIds: new Set([association.demandId]),
      }).status,
    ).toBe("valid");
    const resolved = resolveDemandFootprintAssociation({
      demandId: association.demandId,
      specifications: [spec],
      associations: [association],
    });
    const result = projectDemandResourceFootprint({
      demandProjection: demand,
      association: resolved,
      productiveCandidate: {
        id: "opportunity",
        capacityIntervalId: "opening",
        startsAt: "2026-09-04T15:00:00.000Z",
        endsAt: "2026-09-04T16:00:00.000Z",
        durationMinutes: 60,
        userDayDate: "2026-09-04",
      },
      capacity,
      resolver,
    });
    expect(result.status).toBe("projected");
    if (result.status !== "projected") return;
    expect(result.footprint).toMatchObject({
      productiveMinutes: 60,
      supportMinutes: 30,
      bufferMinutes: 15,
      nominalResourceMinutes: 105,
      unionedResourceMinutes: 105,
      omittedOptionalComponentIds: ["optional-review"],
      productiveClaims: [{ role: "productive", requiredness: "required" }],
      supportClaims: [
        {
          role: "supportActivity",
          componentId: "setup",
          requiredness: "required",
          source: { kind: "compositionRelationship", relationshipId: "relationship" },
        },
      ],
      bufferClaims: [
        { role: "bufferProtection", componentId: "recovery", requiredness: "required" },
      ],
    });
    expect(
      projectDemandResourceFootprint({
        demandProjection: demand,
        association: resolved,
        productiveCandidate: {
          id: "opportunity",
          capacityIntervalId: "opening",
          startsAt: "2026-09-04T15:00:00.000Z",
          endsAt: "2026-09-04T16:00:00.000Z",
          durationMinutes: 60,
          userDayDate: "2026-09-04",
        },
        capacity,
        resolver,
      }),
    ).toEqual(result);
  });

  it("does not infer authority and rejects unavailable required support", () => {
    expect(
      projectDemandResourceFootprint({
        demandProjection: demand,
        association: { status: "unspecified", reason: "noAssociation" },
        productiveCandidate: {
          id: "opportunity",
          capacityIntervalId: "opening",
          startsAt: "2026-09-04T15:00:00.000Z",
          endsAt: "2026-09-04T16:00:00.000Z",
          durationMinutes: 60,
          userDayDate: "2026-09-04",
        },
        capacity,
        resolver,
      }),
    ).toMatchObject({ status: "incomplete", reasons: [{ code: "footprintUnspecified" }] });
    const narrowCapacity = {
      ...capacity,
      intervals: [{ ...capacity.intervals[0]!, startsAt: "2026-09-04T15:00:00.000Z" }],
    };
    expect(
      projectDemandResourceFootprint({
        demandProjection: demand,
        association: resolveDemandFootprintAssociation({
          demandId: association.demandId,
          specifications: [spec],
          associations: [association],
        }),
        productiveCandidate: {
          id: "opportunity",
          capacityIntervalId: "opening",
          startsAt: "2026-09-04T15:00:00.000Z",
          endsAt: "2026-09-04T16:00:00.000Z",
          durationMinutes: 60,
          userDayDate: "2026-09-04",
        },
        capacity: narrowCapacity,
        resolver,
      }),
    ).toMatchObject({ status: "incomplete", reasons: [{ code: "requiredSupportUnavailable" }] });
  });
});
