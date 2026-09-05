import type { GoalId } from "../goals/goal.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  addUserDayLabels,
  resolveUserDayContainingInstant,
  type CanonicalUserDayResolverInput,
} from "../time/canonicalUserDay.js";
import type { CapacityResultV1 } from "./capacity.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import type {
  PlanningFactId,
  PlanningProvenanceV1,
  PlanningRevision,
} from "./planningFoundation.js";

export const DEMAND_RESOURCE_FOOTPRINT_POLICY_V1 = {
  id: "demand-resource-footprint",
  version: 1,
  maximumComponentMinutes: 1440,
  componentScope: "perSession",
} as const;

export type FootprintRequirednessV1 = "required" | "optional";
export type FootprintSourceV1 =
  | { kind: "direct" }
  | {
      kind: "compositionRelationship";
      relationshipId: PlanningFactId;
      relationshipRevision: PlanningRevision;
      parent: { sourceId: string; incarnationId: string };
      child: { sourceId: string; incarnationId: string };
      slot: string;
      semanticsFingerprint: string;
    };
export type SupportGeometryV1 =
  | { kind: "endsAtProductiveStart" | "startsAtProductiveEnd" }
  | {
      kind: "offsetFromProductiveStart" | "offsetFromProductiveEnd";
      anchor: "componentStart" | "componentEnd";
      offsetMinutes: number;
    };
export type DemandSupportComponentV1 = {
  id: string;
  role: "supportActivity";
  scope: "perSession";
  requiredness: FootprintRequirednessV1;
  durationMinutes: number;
  geometry: SupportGeometryV1;
  actor: "user";
  source: FootprintSourceV1;
};
export type DemandBufferComponentV1 = {
  id: string;
  role: "bufferProtection";
  scope: "perSession";
  requiredness: FootprintRequirednessV1;
  target: { kind: "productive" } | { kind: "supportComponent"; componentId: string };
  side: "before" | "after";
  durationMinutes: number;
  source: FootprintSourceV1;
};
export type DemandFootprintComponentV1 = DemandSupportComponentV1 | DemandBufferComponentV1;
export type DemandResourceFootprintSpecV1 = {
  recordType: "demandResourceFootprintSpec";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  status: "active" | "retired";
  name: string;
  variants: Array<{ id: string; name: string; components: DemandFootprintComponentV1[] }>;
  createdAt: string;
  updatedAt: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type DemandResourceFootprintAssociationV1 = {
  recordType: "demandResourceFootprintAssociation";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  demandId: PlanningFactId;
  status: "active" | "retired";
  selection:
    | { kind: "productiveOnly" }
    | {
        kind: "specification";
        specificationId: PlanningFactId;
        specificationRevision: PlanningRevision;
        variantId: string;
        selectedOptionalComponentIds: string[];
      };
  createdAt: string;
  updatedAt: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type ResolvedDemandFootprintAssociationV1 =
  | {
      status: "resolved";
      association: DemandResourceFootprintAssociationV1;
      selection: { kind: "productiveOnly" } | { kind: "specification" };
      specification?: DemandResourceFootprintSpecV1;
      variant?: DemandResourceFootprintSpecV1["variants"][number];
      components: DemandFootprintComponentV1[];
      omittedOptionalComponentIds: string[];
      dependencyFingerprint: string;
    }
  | { status: "unspecified" | "ambiguous" | "missingRevision" | "invalid"; reason: string };

export type ProjectedResourceRoleV1 = "productive" | "supportActivity" | "bufferProtection";
export type ProjectedResourceClaimV1 = {
  id: string;
  role: ProjectedResourceRoleV1;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: LocalDateString;
  capacityIntervalId: string;
  requiredness: "required" | "selectedOptional";
  candidateParentId: string;
  goalId: GoalId;
  demandId: PlanningFactId;
  demandRevision: PlanningRevision;
  demandProjectionId: string;
  productiveOpportunityId: string;
  specificationId?: PlanningFactId;
  specificationRevision?: PlanningRevision;
  associationId?: PlanningFactId;
  associationRevision?: PlanningRevision;
  variantId?: string;
  componentId?: string;
  source: FootprintSourceV1;
  relationship:
    | { kind: "productiveRoot" }
    | { kind: "supportsProductive"; productiveClaimId: string }
    | { kind: "protectsProductive"; productiveClaimId: string }
    | { kind: "protectsSupport"; supportClaimId: string; supportComponentId: string };
  dependencyFingerprint: string;
  provenance: PlanningProvenanceV1;
};
export type ProjectedResourceFootprintV1 = {
  version: 1;
  id: string;
  candidateParentId: string;
  productiveClaims: ProjectedResourceClaimV1[];
  supportClaims: ProjectedResourceClaimV1[];
  bufferClaims: ProjectedResourceClaimV1[];
  omittedOptionalComponentIds: string[];
  productiveMinutes: number;
  supportMinutes: number;
  bufferMinutes: number;
  nominalResourceMinutes: number;
  unionedResourceMinutes: number;
  dependencyFingerprint: string;
  provenance: PlanningProvenanceV1;
};
export type ProductiveCandidateV1 = {
  id: string;
  capacityIntervalId: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: LocalDateString;
};
export type FootprintProjectionResultV1 =
  | { status: "projected"; footprint: ProjectedResourceFootprintV1 }
  | {
      status: "incomplete" | "invalid";
      reasons: Array<{
        code:
          | "footprintUnspecified"
          | "footprintAssociationAmbiguous"
          | "footprintRevisionMissing"
          | "unsupportedFootprintRule"
          | "footprintCoverageIncomplete"
          | "requiredSupportUnavailable"
          | "requiredBufferUnavailable"
          | "componentCrossesUserDay"
          | "resourceConflict";
      }>;
    };

export function resolveDemandFootprintAssociation(input: {
  demandId: PlanningFactId;
  specifications: readonly DemandResourceFootprintSpecV1[];
  associations: readonly DemandResourceFootprintAssociationV1[];
}): ResolvedDemandFootprintAssociationV1 {
  const current = latest(input.associations).filter(
    (value) => value.demandId === input.demandId && value.status === "active",
  );
  if (!current.length) return { status: "unspecified", reason: "noAssociation" };
  if (current.length !== 1) return { status: "ambiguous", reason: "multipleAssociations" };
  const association = current[0]!;
  if (association.selection.kind === "productiveOnly")
    return {
      status: "resolved",
      association: clone(association),
      selection: { kind: "productiveOnly" },
      components: [],
      omittedOptionalComponentIds: [],
      dependencyFingerprint: capacityFingerprint({ association }),
    };
  const selection = association.selection;
  const specification = input.specifications.find(
    (value) =>
      value.id === selection.specificationId && value.revision === selection.specificationRevision,
  );
  if (!specification || specification.status !== "active")
    return { status: "missingRevision", reason: "specificationRevisionUnavailable" };
  const variant = specification.variants.find((value) => value.id === selection.variantId);
  if (!variant) return { status: "invalid", reason: "variantUnavailable" };
  const selected = new Set(selection.selectedOptionalComponentIds),
    components = variant.components.filter(
      (value) => value.requiredness === "required" || selected.has(value.id),
    ),
    omitted = variant.components
      .filter((value) => value.requiredness === "optional" && !selected.has(value.id))
      .map((value) => value.id)
      .sort();
  return {
    status: "resolved",
    association: clone(association),
    selection: { kind: "specification" },
    specification: clone(specification),
    variant: clone(variant),
    components: clone(components).sort(componentCompare),
    omittedOptionalComponentIds: omitted,
    dependencyFingerprint: capacityFingerprint({ association, specification, variant }),
  };
}

export function projectDemandResourceFootprint(input: {
  demandProjection: DemandProjectionV1;
  association: ResolvedDemandFootprintAssociationV1;
  productiveCandidate: ProductiveCandidateV1;
  capacity: CapacityResultV1;
  resolver: CanonicalUserDayResolverInput;
}): FootprintProjectionResultV1 {
  if (input.association.status !== "resolved")
    return {
      status: "incomplete",
      reasons: [
        {
          code:
            input.association.status === "unspecified"
              ? "footprintUnspecified"
              : input.association.status === "ambiguous"
                ? "footprintAssociationAmbiguous"
                : "footprintRevisionMissing",
        },
      ],
    };
  const candidate = input.productiveCandidate,
    start = Date.parse(candidate.startsAt),
    end = Date.parse(candidate.endsAt);
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start >= end ||
    (end - start) / 60_000 !== candidate.durationMinutes
  )
    return { status: "invalid", reasons: [{ code: "unsupportedFootprintRule" }] };
  const association = input.association.association,
    specification = input.association.specification,
    variant = input.association.variant,
    candidateParentId = capacityFingerprint({
      policy: DEMAND_RESOURCE_FOOTPRINT_POLICY_V1,
      goal: [input.demandProjection.goalId, input.demandProjection.goalRevision],
      demand: [input.demandProjection.demandId, input.demandProjection.demandRevision],
      projection: input.demandProjection.semanticId,
      candidate,
      association: [association.id, association.revision],
      specification: specification ? [specification.id, specification.revision] : "productiveOnly",
      variant: variant?.id,
      selected:
        association.selection.kind === "specification"
          ? [...association.selection.selectedOptionalComponentIds].sort()
          : [],
    });
  const base = {
    candidateParentId,
    goalId: input.demandProjection.goalId,
    demandId: input.demandProjection.demandId,
    demandRevision: input.demandProjection.demandRevision,
    demandProjectionId: input.demandProjection.semanticId,
    productiveOpportunityId: candidate.id,
    associationId: association.id,
    associationRevision: association.revision,
    ...(specification
      ? { specificationId: specification.id, specificationRevision: specification.revision }
      : {}),
    ...(variant ? { variantId: variant.id } : {}),
  };
  const raw: Array<{
    role: ProjectedResourceRoleV1;
    startsAt: number;
    endsAt: number;
    requiredness: ProjectedResourceClaimV1["requiredness"];
    componentId?: string;
    source: FootprintSourceV1;
  }> = [
    {
      role: "productive",
      startsAt: start,
      endsAt: end,
      requiredness: "required",
      source: { kind: "direct" },
    },
  ];
  const supportGeometry = new Map<string, { startsAt: number; endsAt: number }>();
  try {
    for (const component of input.association.components.filter(isSupport)) {
      const geometry = supportInterval(component, start, end);
      supportGeometry.set(component.id, geometry);
      raw.push({
        role: "supportActivity",
        ...geometry,
        requiredness: component.requiredness === "required" ? "required" : "selectedOptional",
        componentId: component.id,
        source: clone(component.source),
      });
    }
    for (const component of input.association.components.filter(isBuffer)) {
      const target =
        component.target.kind === "productive"
          ? { startsAt: start, endsAt: end }
          : supportGeometry.get(component.target.componentId);
      if (!target) return { status: "invalid", reasons: [{ code: "unsupportedFootprintRule" }] };
      raw.push({
        role: "bufferProtection",
        startsAt:
          component.side === "before"
            ? target.startsAt - component.durationMinutes * 60_000
            : target.endsAt,
        endsAt:
          component.side === "before"
            ? target.startsAt
            : target.endsAt + component.durationMinutes * 60_000,
        requiredness: component.requiredness === "required" ? "required" : "selectedOptional",
        componentId: component.id,
        source: clone(component.source),
      });
    }
  } catch {
    return { status: "invalid", reasons: [{ code: "unsupportedFootprintRule" }] };
  }
  const claims: ProjectedResourceClaimV1[] = [];
  for (const value of raw) {
    const startsAt = new Date(value.startsAt),
      endsAt = new Date(value.endsAt),
      window = resolveUserDayContainingInstant({ ...input.resolver, instant: startsAt });
    if (endsAt.getTime() > window.end.getTime())
      return { status: "incomplete", reasons: [{ code: "componentCrossesUserDay" }] };
    if (!withinAdjacent(candidate.userDayDate, window.userDayDate))
      return { status: "incomplete", reasons: [{ code: "footprintCoverageIncomplete" }] };
    const capacityInterval = input.capacity.intervals.find(
      (interval) =>
        Date.parse(interval.startsAt) <= value.startsAt &&
        value.endsAt <= Date.parse(interval.endsAt) &&
        interval.allocability === "allocatable",
    );
    if (!capacityInterval)
      return {
        status: "incomplete",
        reasons: [
          {
            code:
              value.role === "supportActivity"
                ? "requiredSupportUnavailable"
                : value.role === "bufferProtection"
                  ? "requiredBufferUnavailable"
                  : "footprintCoverageIncomplete",
          },
        ],
      };
    const productiveClaim = claims.find((claim) => claim.role === "productive"),
      supportTarget =
        value.role === "bufferProtection" && value.componentId
          ? input.association.components.find(
              (component) =>
                component.role === "bufferProtection" && component.id === value.componentId,
            )
          : undefined,
      supportTargetComponentId =
        supportTarget?.role === "bufferProtection" &&
        supportTarget.target.kind === "supportComponent"
          ? supportTarget.target.componentId
          : undefined,
      relationship: ProjectedResourceClaimV1["relationship"] =
        value.role === "productive"
          ? { kind: "productiveRoot" }
          : value.role === "supportActivity"
            ? { kind: "supportsProductive", productiveClaimId: productiveClaim!.id }
            : supportTargetComponentId
              ? {
                  kind: "protectsSupport",
                  supportClaimId: claims.find(
                    (claim) =>
                      claim.role === "supportActivity" &&
                      claim.componentId === supportTargetComponentId,
                  )!.id,
                  supportComponentId: supportTargetComponentId,
                }
              : { kind: "protectsProductive", productiveClaimId: productiveClaim!.id };
    const semantic = {
      ...base,
      role: value.role,
      interval: [startsAt.toISOString(), endsAt.toISOString()],
      userDayDate: window.userDayDate,
      capacityIntervalId: capacityInterval.id,
      requiredness: value.requiredness,
      ...(value.componentId ? { componentId: value.componentId } : {}),
      source: value.source,
      relationship,
    };
    claims.push({
      id: capacityFingerprint({ policy: DEMAND_RESOURCE_FOOTPRINT_POLICY_V1, ...semantic }),
      ...semantic,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      durationMinutes: (value.endsAt - value.startsAt) / 60_000,
      dependencyFingerprint: input.association.dependencyFingerprint,
      provenance: derived(),
    });
  }
  const activities = claims.filter((value) => value.role !== "bufferProtection"),
    buffers = claims.filter((value) => value.role === "bufferProtection");
  if (
    activities.some((value, index) =>
      activities.slice(index + 1).some((other) => overlaps(value, other)),
    ) ||
    buffers.some((value) => activities.some((other) => overlaps(value, other)))
  )
    return { status: "invalid", reasons: [{ code: "resourceConflict" }] };
  const productiveClaims = claims.filter((value) => value.role === "productive").sort(claimCompare),
    supportClaims = claims.filter((value) => value.role === "supportActivity").sort(claimCompare),
    bufferClaims = claims.filter((value) => value.role === "bufferProtection").sort(claimCompare),
    productiveMinutes = total(productiveClaims),
    supportMinutes = total(supportClaims),
    bufferMinutes = total(bufferClaims),
    unionedResourceMinutes = unionMinutes(claims),
    semantic = {
      candidateParentId,
      productiveClaims,
      supportClaims,
      bufferClaims,
      omittedOptionalComponentIds: input.association.omittedOptionalComponentIds,
      productiveMinutes,
      supportMinutes,
      bufferMinutes,
      nominalResourceMinutes: productiveMinutes + supportMinutes + bufferMinutes,
      unionedResourceMinutes,
      dependencyFingerprint: input.association.dependencyFingerprint,
    };
  return {
    status: "projected",
    footprint: {
      version: 1,
      id: capacityFingerprint(semantic),
      ...semantic,
      provenance: derived(),
    },
  };
}

export function validateDemandResourceAuthority(input: {
  specifications: unknown;
  associations: unknown;
  demandIds?: ReadonlySet<string>;
}):
  | {
      status: "valid";
      specifications: DemandResourceFootprintSpecV1[];
      associations: DemandResourceFootprintAssociationV1[];
    }
  | { status: "invalid"; issues: string[] } {
  if (!Array.isArray(input.specifications) || !Array.isArray(input.associations))
    return { status: "invalid", issues: ["invalidResourceAuthority"] };
  const specifications = input.specifications.filter(validSpec),
    associations = input.associations.filter(validAssociation);
  const issues: string[] = [];
  if (specifications.length !== input.specifications.length) issues.push("invalidSpecification");
  if (associations.length !== input.associations.length) issues.push("invalidAssociation");
  validateHistory(specifications, issues);
  validateHistory(associations, issues);
  const currentAssociations = latest(associations).filter((value) => value.status === "active");
  if (
    new Set(currentAssociations.map((value) => value.demandId)).size !== currentAssociations.length
  )
    issues.push("ambiguousAssociation");
  for (const association of associations) {
    if (input.demandIds && !input.demandIds.has(association.demandId)) issues.push("missingDemand");
    if (association.selection.kind === "specification") {
      const selection = association.selection;
      const spec = specifications.find(
        (value) =>
          value.id === selection.specificationId &&
          value.revision === selection.specificationRevision,
      );
      const variant = spec?.variants.find((value) => value.id === selection.variantId);
      if (!spec || !variant) issues.push("missingSpecificationRevision");
      else {
        const optional = new Set(
          variant.components
            .filter((value) => value.requiredness === "optional")
            .map((value) => value.id),
        );
        if (selection.selectedOptionalComponentIds.some((id) => !optional.has(id)))
          issues.push("invalidOptionalSelection");
      }
    }
  }
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)].sort() }
    : {
        status: "valid",
        specifications: clone(specifications).sort(recordCompare),
        associations: clone(associations).sort(recordCompare),
      };
}

function validSpec(value: unknown): value is DemandResourceFootprintSpecV1 {
  return (
    record(value) &&
    value.recordType === "demandResourceFootprintSpec" &&
    value.version === 1 &&
    text(value.id) &&
    revision(value.revision) &&
    (value.status === "active" || value.status === "retired") &&
    text(value.name) &&
    Array.isArray(value.variants) &&
    value.variants.length > 0 &&
    value.variants.every(validVariant) &&
    unique(value.variants.map((item) => item.id)) &&
    timestamp(value.createdAt) &&
    timestamp(value.updatedAt) &&
    record(value.provenance)
  );
}
function validVariant(value: unknown): value is DemandResourceFootprintSpecV1["variants"][number] {
  return (
    record(value) &&
    text(value.id) &&
    text(value.name) &&
    Array.isArray(value.components) &&
    value.components.every(validComponent) &&
    unique(value.components.map((item) => item.id)) &&
    (value.components as DemandFootprintComponentV1[])
      .filter((item): item is DemandBufferComponentV1 => item.role === "bufferProtection")
      .every(
        (item) =>
          item.target.kind === "productive" ||
          (value.components as DemandFootprintComponentV1[]).some((candidate) => {
            const target = item.target;
            return (
              target.kind === "supportComponent" &&
              candidate.role === "supportActivity" &&
              candidate.id === target.componentId
            );
          }),
      )
  );
}
function validComponent(value: unknown): value is DemandFootprintComponentV1 {
  if (
    !record(value) ||
    !text(value.id) ||
    value.scope !== "perSession" ||
    !["required", "optional"].includes(String(value.requiredness)) ||
    !positiveMinutes(value.durationMinutes) ||
    !validSource(value.source)
  )
    return false;
  if (value.role === "supportActivity")
    return value.actor === "user" && validGeometry(value.geometry);
  return (
    value.role === "bufferProtection" &&
    (value.side === "before" || value.side === "after") &&
    record(value.target) &&
    (value.target.kind === "productive" ||
      (value.target.kind === "supportComponent" && text(value.target.componentId)))
  );
}
function validAssociation(value: unknown): value is DemandResourceFootprintAssociationV1 {
  return (
    record(value) &&
    value.recordType === "demandResourceFootprintAssociation" &&
    value.version === 1 &&
    text(value.id) &&
    revision(value.revision) &&
    text(value.demandId) &&
    (value.status === "active" || value.status === "retired") &&
    validSelection(value.selection) &&
    timestamp(value.createdAt) &&
    timestamp(value.updatedAt) &&
    record(value.provenance)
  );
}
function validSelection(value: unknown) {
  return (
    record(value) &&
    (value.kind === "productiveOnly" ||
      (value.kind === "specification" &&
        text(value.specificationId) &&
        revision(value.specificationRevision) &&
        text(value.variantId) &&
        Array.isArray(value.selectedOptionalComponentIds) &&
        value.selectedOptionalComponentIds.every(text) &&
        unique(value.selectedOptionalComponentIds)))
  );
}
function validGeometry(value: unknown) {
  return (
    record(value) &&
    (["endsAtProductiveStart", "startsAtProductiveEnd"].includes(String(value.kind)) ||
      (["offsetFromProductiveStart", "offsetFromProductiveEnd"].includes(String(value.kind)) &&
        ["componentStart", "componentEnd"].includes(String(value.anchor)) &&
        Number.isInteger(value.offsetMinutes)))
  );
}
function validSource(value: unknown) {
  return (
    record(value) &&
    (value.kind === "direct" ||
      (value.kind === "compositionRelationship" &&
        text(value.relationshipId) &&
        revision(value.relationshipRevision) &&
        record(value.parent) &&
        text(value.parent.sourceId) &&
        text(value.parent.incarnationId) &&
        record(value.child) &&
        text(value.child.sourceId) &&
        text(value.child.incarnationId) &&
        typeof value.slot === "string" &&
        text(value.semanticsFingerprint)))
  );
}
function supportInterval(component: DemandSupportComponentV1, start: number, end: number) {
  const duration = component.durationMinutes * 60_000;
  if (component.geometry.kind === "endsAtProductiveStart")
    return { startsAt: start - duration, endsAt: start };
  if (component.geometry.kind === "startsAtProductiveEnd")
    return { startsAt: end, endsAt: end + duration };
  const geometry = component.geometry as Extract<
      SupportGeometryV1,
      { kind: "offsetFromProductiveStart" | "offsetFromProductiveEnd" }
    >,
    base = geometry.kind === "offsetFromProductiveStart" ? start : end,
    anchor = base + geometry.offsetMinutes * 60_000;
  return geometry.anchor === "componentStart"
    ? { startsAt: anchor, endsAt: anchor + duration }
    : { startsAt: anchor - duration, endsAt: anchor };
}
function isSupport(value: DemandFootprintComponentV1): value is DemandSupportComponentV1 {
  return value.role === "supportActivity";
}
function isBuffer(value: DemandFootprintComponentV1): value is DemandBufferComponentV1 {
  return value.role === "bufferProtection";
}
function withinAdjacent(productive: LocalDateString, component: LocalDateString) {
  return (
    component === productive ||
    component === addUserDayLabels(productive, -1) ||
    component === addUserDayLabels(productive, 1)
  );
}
function total(values: ProjectedResourceClaimV1[]) {
  return values.reduce((sum, value) => sum + value.durationMinutes, 0);
}
function unionMinutes(values: ProjectedResourceClaimV1[]) {
  const sorted = values
    .map((value) => [Date.parse(value.startsAt), Date.parse(value.endsAt)] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let totalValue = 0,
    start: number | undefined,
    end: number | undefined;
  for (const interval of sorted) {
    if (start === undefined) [start, end] = interval;
    else if (interval[0] <= end!) end = Math.max(end!, interval[1]);
    else {
      totalValue += (end! - start) / 60_000;
      [start, end] = interval;
    }
  }
  return start === undefined ? 0 : totalValue + (end! - start) / 60_000;
}
function overlaps(
  a: { startsAt: string; endsAt: string },
  b: { startsAt: string; endsAt: string },
): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
function componentCompare(a: DemandFootprintComponentV1, b: DemandFootprintComponentV1) {
  return `${a.role}|${a.id}`.localeCompare(`${b.role}|${b.id}`);
}
function claimCompare(a: ProjectedResourceClaimV1, b: ProjectedResourceClaimV1) {
  return `${a.startsAt}|${a.endsAt}|${a.role}|${a.id}`.localeCompare(
    `${b.startsAt}|${b.endsAt}|${b.role}|${b.id}`,
  );
}
function recordCompare(a: { id: string; revision: number }, b: { id: string; revision: number }) {
  return a.id.localeCompare(b.id) || a.revision - b.revision;
}
function latest<T extends { id: string; revision: number }>(values: readonly T[]) {
  const result = new Map<string, T>();
  for (const value of values)
    if (!result.has(value.id) || result.get(value.id)!.revision < value.revision)
      result.set(value.id, value);
  return [...result.values()];
}
function validateHistory(values: Array<{ id: string; revision: number }>, issues: string[]) {
  const byId = new Map<string, number[]>();
  for (const value of values) byId.set(value.id, [...(byId.get(value.id) ?? []), value.revision]);
  for (const revisions of byId.values()) {
    const sorted = revisions.sort((a, b) => a - b);
    if (sorted.some((revisionValue, index) => revisionValue !== index + 1))
      issues.push("invalidRevisionHistory");
  }
}
function positiveMinutes(value: unknown) {
  return (
    Number.isInteger(value) &&
    Number(value) > 0 &&
    Number(value) <= DEMAND_RESOURCE_FOOTPRINT_POLICY_V1.maximumComponentMinutes
  );
}
function revision(value: unknown) {
  return Number.isInteger(value) && Number(value) > 0;
}
function timestamp(value: unknown) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}
function text(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
function unique(values: string[]) {
  return new Set(values).size === values.length;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function derived(): PlanningProvenanceV1 {
  return {
    version: 1,
    role: "derivedArtifact",
    origin: { kind: "derivedFromDependencies" },
    algorithm: { id: DEMAND_RESOURCE_FOOTPRINT_POLICY_V1.id, version: 1 },
  };
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
