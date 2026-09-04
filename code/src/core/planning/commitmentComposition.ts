import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { DraftScheduledBlock } from "../blocks/types.js";
import type { RecurrenceFrequency } from "../blocks/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { Weekday } from "../time/types.js";
import type {
  PlanningDependencyKind,
  PlanningDependencyReferenceV1,
  PlanningFactId,
  PlanningProvenanceV1,
  PlanningRevision,
} from "./planningFoundation.js";

export const COMPOSITION_AUTHORITY_VERSION = 1 as const;
export const COMPOSITION_POLICY = { id: "commitment-composition", version: 1 } as const;

export type CommitmentEndpointV1 = {
  kind: "template";
  sourceId: string;
  incarnationId: SourceIncarnationId;
};
export type AttachmentTimingV1 =
  | { kind: "endsAtParentStart" }
  | { kind: "startsAtParentEnd" }
  | { kind: "beforeParentWithGap"; gap: { kind: "exact" | "minimum"; minutes: number } }
  | { kind: "afterParentWithGap"; gap: { kind: "exact" | "minimum"; minutes: number } }
  | {
      kind: "offsetFromParentStart" | "offsetFromParentEnd";
      anchor: "componentStart" | "componentEnd";
      offsetMinutes: number;
    };
export type AttachmentApplicabilityV1 = {
  dateInterval?: {
    startUserDayDate: LocalDateString;
    endUserDayDateExclusive: LocalDateString;
  };
  weekdays?: Weekday[];
  includeOccurrenceIds?: string[];
  excludeOccurrenceIds?: string[];
};
export type AttachmentRelationshipV1 = {
  recordType: "attachmentRelationship";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  status: "active" | "retired";
  parent: CommitmentEndpointV1;
  child: CommitmentEndpointV1;
  slot: string;
  order: number;
  applicability: AttachmentApplicabilityV1;
  requiredness: "required" | "optional";
  timing: AttachmentTimingV1;
  timingStrictness: "constraint" | "preference";
  buffer: { beforeMinutes: number; afterMinutes: number };
  goalSupport: "none" | "supportForParentGoal";
  createdAt: string;
  updatedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type CompositeDecisionV1 = {
  recordType: "compositeDecision";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  status: "active" | "retired";
  compositeId: string;
  expectedFingerprint: string;
  parentOccurrenceId: string;
  deltas: Array<
    | { relationshipId: PlanningFactId; action: "omitOptional" }
    | { relationshipId: PlanningFactId; action: "offset"; minutes: number }
  >;
  acceptedAt: string;
  updatedAt: string;
  provenance: PlanningProvenanceV1;
};
export type CompositionAuthorityV1 = {
  version: 1;
  relationships: AttachmentRelationshipV1[];
  decisions: CompositeDecisionV1[];
};
export type CompositionTemplateSourceV1 = CommitmentEndpointV1 & {
  title: string;
  durationMinutes: number;
  revisionToken: string;
  userId: string;
  category: DraftScheduledBlock["category"];
  priority: DraftScheduledBlock["priority"];
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  recurrence?: { id: string; incarnationId: SourceIncarnationId; frequency: RecurrenceFrequency };
};
export type CompositeFootprintIntervalV1 = {
  id: string;
  classification: "parentCore" | "supportActivity" | "buffer" | "requiredLiability";
  startsAt: string;
  endsAt: string;
  relationshipId?: PlanningFactId;
};
export type CompositeLiabilityV1 = {
  version: 1;
  compositeId: string;
  relationshipId: PlanningFactId;
  relationshipRevision: PlanningRevision;
  reason: "missingChild" | "outsidePlanningWindow" | "conflict" | "staleDecision";
  requiredMinutes: number;
  startsAt?: string;
  endsAt?: string;
};
export type CompositeOccurrenceV1 = {
  version: 1;
  compositeId: string;
  fingerprint: string;
  parentOccurrenceId: string;
  state: "fullyFeasible" | "feasibleWithoutOptional" | "requiredComponentFailure" | "stale";
  attachedOccurrences: DraftScheduledBlock[];
  omittedOptionalRelationshipIds: PlanningFactId[];
  footprint: CompositeFootprintIntervalV1[];
  liabilities: CompositeLiabilityV1[];
  dependencies: PlanningDependencyReferenceV1[];
  provenance: PlanningProvenanceV1;
};

export function emptyCompositionAuthority(): CompositionAuthorityV1 {
  return { version: 1, relationships: [], decisions: [] };
}

export function validateCompositionAuthority(
  value: unknown,
  sources?: readonly CompositionTemplateSourceV1[],
):
  | { status: "valid"; authority: CompositionAuthorityV1 }
  | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.relationships) ||
    !Array.isArray(value.decisions)
  )
    return { status: "invalid", issues: ["invalidAuthority"] };
  const relationships = value.relationships.filter(validateRelationship);
  const decisions = value.decisions.filter(validateDecision);
  const issues: string[] = [];
  if (relationships.length !== value.relationships.length) issues.push("invalidRelationship");
  if (decisions.length !== value.decisions.length) issues.push("invalidDecision");
  validateHistories(relationships, issues);
  validateHistories(decisions, issues);
  const current = latest(relationships).filter((item) => item.status === "active");
  const sourceKeys = new Set(sources?.map(endpointKey) ?? []);
  for (const relation of current) {
    if (
      relation.parent.sourceId === relation.child.sourceId &&
      relation.parent.incarnationId === relation.child.incarnationId
    )
      issues.push(`self:${relation.id}`);
    if (
      sources &&
      (!sourceKeys.has(endpointKey(relation.parent)) ||
        !sourceKeys.has(endpointKey(relation.child)))
    )
      issues.push(`dangling:${relation.id}`);
    if (
      current.some(
        (other) =>
          other !== relation &&
          endpointKey(other.parent) === endpointKey(relation.parent) &&
          other.slot === relation.slot,
      )
    )
      issues.push(`slot:${relation.id}`);
  }
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)].sort() }
    : {
        status: "valid",
        authority: {
          version: 1,
          relationships: clone(relationships).sort(compare),
          decisions: clone(decisions).sort(compare),
        },
      };
}

export function projectCompositeOccurrence(input: {
  parent: DraftScheduledBlock;
  parentSource: CompositionTemplateSourceV1;
  sources: readonly CompositionTemplateSourceV1[];
  authority: CompositionAuthorityV1;
  planningWindow: { startsAt: Date; endsAt: Date };
  occupied?: readonly { id: string; startsAt: Date; endsAt: Date }[];
}): CompositeOccurrenceV1 {
  const relationships = latest(input.authority.relationships)
    .filter(
      (item) =>
        item.status === "active" && endpointKey(item.parent) === endpointKey(input.parentSource),
    )
    .filter((item) => applies(item.applicability, input.parent));
  const compositeId = semanticFingerprint({
    policy: COMPOSITION_POLICY,
    parentOccurrenceId: input.parent.id,
  });
  const semanticBase = {
    compositeId,
    parent: interval(input.parent),
    relationships,
    sources: input.sources.map(sourceSemantic),
  };
  const baseFingerprint = semanticFingerprint(semanticBase);
  const decision = latest(input.authority.decisions).find(
    (item) =>
      item.status === "active" &&
      item.compositeId === compositeId &&
      item.parentOccurrenceId === input.parent.id,
  );
  if (decision && decision.expectedFingerprint !== baseFingerprint)
    return result(
      "stale",
      [],
      [],
      [],
      relationships,
      compositeId,
      baseFingerprint,
      input,
      decision,
    );
  const attached: DraftScheduledBlock[] = [],
    footprintValue: CompositeFootprintIntervalV1[] = [
      footprint(input.parent.id, "parentCore", input.parent),
    ],
    liabilities: CompositeLiabilityV1[] = [],
    omitted: PlanningFactId[] = [],
    occupied = [...(input.occupied ?? [])];
  for (const relation of relationships.sort(
    (a, b) => a.order - b.order || a.slot.localeCompare(b.slot) || a.id.localeCompare(b.id),
  )) {
    const delta = decision?.deltas.find((item) => item.relationshipId === relation.id);
    if (delta?.action === "omitOptional" && relation.requiredness === "optional") {
      omitted.push(relation.id);
      continue;
    }
    const child = input.sources.find((item) => endpointKey(item) === endpointKey(relation.child));
    if (!child) {
      fail(relation, "missingChild", liabilities, input.parent);
      continue;
    }
    const geometry = place(
      input.parent,
      child.durationMinutes,
      relation.timing,
      delta?.action === "offset" ? delta.minutes : 0,
    );
    const beforeMinutes = Math.max(child.bufferBeforeMinutes ?? 0, relation.buffer.beforeMinutes),
      afterMinutes = Math.max(child.bufferAfterMinutes ?? 0, relation.buffer.afterMinutes),
      protectedGeometry = {
        startsAt: new Date(geometry.startsAt.getTime() - beforeMinutes * 60_000),
        endsAt: new Date(geometry.endsAt.getTime() + afterMinutes * 60_000),
      };
    const collision = occupied.some(
      (item) =>
        item.id !== input.parent.id &&
        protectedGeometry.startsAt < item.endsAt &&
        item.startsAt < protectedGeometry.endsAt,
    );
    const out =
      protectedGeometry.startsAt < input.planningWindow.startsAt ||
      protectedGeometry.endsAt > input.planningWindow.endsAt;
    if (collision || out) {
      if (relation.requiredness === "required")
        fail(
          relation,
          collision ? "conflict" : "outsidePlanningWindow",
          liabilities,
          geometry,
          child.durationMinutes,
        );
      else omitted.push(relation.id);
      continue;
    }
    const block: DraftScheduledBlock = {
      id: pairingId(input.parent.id, relation),
      userId: child.userId,
      templateId: child.sourceId,
      source: "template",
      title: child.title,
      category: child.category,
      placementType: "fixed",
      startsAt: geometry.startsAt,
      endsAt: geometry.endsAt,
      ...(beforeMinutes ? { bufferBeforeMinutes: beforeMinutes } : {}),
      ...(afterMinutes ? { bufferAfterMinutes: afterMinutes } : {}),
      userDayDate: input.parent.userDayDate,
      userWeekStartDate: input.parent.userWeekStartDate,
      priority: child.priority,
      status: "planned",
      externalResources: [],
      composition: [
        compositeId,
        input.parent.id,
        pairingId(input.parent.id, relation),
        relation.id,
        relation.revision,
      ],
      ...(child.recurrence &&
      ["daily", "specificWeekdays", "weekly", "timesPerUserWeek"].includes(
        child.recurrence.frequency,
      )
        ? {
            occurrenceIdentity:
              child.recurrence.frequency === "daily" ||
              child.recurrence.frequency === "specificWeekdays"
                ? {
                    version: 1,
                    sourceKind: "template",
                    frequency: child.recurrence.frequency,
                    templateId: child.sourceId,
                    recurrenceId: child.recurrence.id,
                    scopeKind: "userDay",
                    userDayDate: input.parent.userDayDate,
                    slot: 0,
                  }
                : {
                    version: 1,
                    sourceKind: "template",
                    frequency: child.recurrence.frequency as "weekly" | "timesPerUserWeek",
                    templateId: child.sourceId,
                    recurrenceId: child.recurrence.id,
                    scopeKind: "userWeek",
                    userWeekStartDate: input.parent.userWeekStartDate,
                    slot: 0,
                  },
            commitmentNavigationIdentity: {
              templateId: child.sourceId,
              templateIncarnationId: child.incarnationId,
              recurrenceId: child.recurrence.id,
              recurrenceIncarnationId: child.recurrence.incarnationId,
            },
          }
        : {}),
    };
    attached.push(block);
    occupied.push({ id: block.id, ...protectedGeometry });
    footprintValue.push(footprint(block.id, "supportActivity", block, relation.id));
    addBuffers(footprintValue, block, relation.id, beforeMinutes, afterMinutes);
  }
  for (const liability of liabilities) {
    if (liability.startsAt && liability.endsAt)
      footprintValue.push({
        id: `${liability.relationshipId}:liability`,
        classification: "requiredLiability",
        startsAt: liability.startsAt,
        endsAt: liability.endsAt,
        relationshipId: liability.relationshipId,
      });
  }
  const state = liabilities.length
    ? "requiredComponentFailure"
    : omitted.length
      ? "feasibleWithoutOptional"
      : "fullyFeasible";
  return result(
    state,
    attached,
    footprintValue,
    liabilities,
    relationships,
    compositeId,
    baseFingerprint,
    input,
    decision,
    omitted,
  );
}

export function pairingId(parentOccurrenceId: string, relation: AttachmentRelationshipV1) {
  return semanticFingerprint({
    policy: COMPOSITION_POLICY,
    parentOccurrenceId,
    relationshipId: relation.id,
    relationshipRevision: relation.revision,
    child: relation.child,
    slot: relation.slot,
  });
}
export function relationshipDependency(
  value: AttachmentRelationshipV1,
): PlanningDependencyReferenceV1 {
  return {
    version: 1,
    kind: "commitment.attachment" as PlanningDependencyKind,
    id: value.id,
    revision: value.revision,
  };
}

function result(
  state: CompositeOccurrenceV1["state"],
  attachedOccurrences: DraftScheduledBlock[],
  footprintValue: CompositeFootprintIntervalV1[],
  liabilities: CompositeLiabilityV1[],
  relationships: AttachmentRelationshipV1[],
  compositeId: string,
  fingerprintValue: string,
  input: { parent: DraftScheduledBlock },
  decision?: CompositeDecisionV1,
  omittedOptionalRelationshipIds: PlanningFactId[] = [],
): CompositeOccurrenceV1 {
  const resolvedLiabilities = liabilities.map((value) => ({ ...value, compositeId }));
  const dependencies = relationships.map(relationshipDependency);
  if (decision)
    dependencies.push({
      version: 1,
      kind: "commitment.compositeDecision" as PlanningDependencyKind,
      id: decision.id,
      revision: decision.revision,
    });
  return {
    version: 1,
    compositeId,
    fingerprint: fingerprintValue,
    parentOccurrenceId: input.parent.id,
    state,
    attachedOccurrences: clone(attachedOccurrences),
    omittedOptionalRelationshipIds: [...omittedOptionalRelationshipIds],
    footprint: clone(footprintValue),
    liabilities: clone(resolvedLiabilities),
    dependencies,
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
      algorithm: COMPOSITION_POLICY,
    },
  };
}
function applies(value: AttachmentApplicabilityV1, parent: DraftScheduledBlock) {
  if (
    value.dateInterval &&
    (parent.userDayDate < value.dateInterval.startUserDayDate ||
      parent.userDayDate >= value.dateInterval.endUserDayDateExclusive)
  )
    return false;
  if (value.weekdays?.length && !value.weekdays.includes(weekday(parent.userDayDate))) return false;
  if (value.includeOccurrenceIds?.length && !value.includeOccurrenceIds.includes(parent.id))
    return false;
  return !value.excludeOccurrenceIds?.includes(parent.id);
}
function place(
  parent: DraftScheduledBlock,
  duration: number,
  timing: AttachmentTimingV1,
  decisionOffset: number,
) {
  const minute = 60_000;
  let end: number;
  if (timing.kind === "endsAtParentStart") end = parent.startsAt.getTime();
  else if (timing.kind === "beforeParentWithGap")
    end = parent.startsAt.getTime() - timing.gap.minutes * minute;
  else if (timing.kind === "startsAtParentEnd")
    return dates(parent.endsAt.getTime() + decisionOffset * minute, duration);
  else if (timing.kind === "afterParentWithGap")
    return dates(
      parent.endsAt.getTime() + timing.gap.minutes * minute + decisionOffset * minute,
      duration,
    );
  else {
    const base =
      timing.kind === "offsetFromParentStart" ? parent.startsAt.getTime() : parent.endsAt.getTime();
    const anchor = base + (timing.offsetMinutes + decisionOffset) * minute;
    return timing.anchor === "componentStart"
      ? dates(anchor, duration)
      : { startsAt: new Date(anchor - duration * minute), endsAt: new Date(anchor) };
  }
  end += decisionOffset * minute;
  return { startsAt: new Date(end - duration * minute), endsAt: new Date(end) };
}
function dates(start: number, duration: number) {
  return { startsAt: new Date(start), endsAt: new Date(start + duration * 60_000) };
}
function fail(
  relation: AttachmentRelationshipV1,
  reason: CompositeLiabilityV1["reason"],
  liabilities: CompositeLiabilityV1[],
  geometry: { startsAt: Date; endsAt: Date },
  minutes = Math.round((geometry.endsAt.getTime() - geometry.startsAt.getTime()) / 60_000),
) {
  liabilities.push({
    version: 1,
    compositeId: "pending",
    relationshipId: relation.id,
    relationshipRevision: relation.revision,
    reason,
    requiredMinutes: minutes,
    startsAt: geometry.startsAt.toISOString(),
    endsAt: geometry.endsAt.toISOString(),
  });
}
function addBuffers(
  values: CompositeFootprintIntervalV1[],
  block: DraftScheduledBlock,
  relationshipId: PlanningFactId,
  beforeMinutes: number,
  afterMinutes: number,
) {
  if (beforeMinutes)
    values.push({
      id: `${block.id}:before`,
      classification: "buffer",
      startsAt: new Date(block.startsAt.getTime() - beforeMinutes * 60_000).toISOString(),
      endsAt: block.startsAt.toISOString(),
      relationshipId,
    });
  if (afterMinutes)
    values.push({
      id: `${block.id}:after`,
      classification: "buffer",
      startsAt: block.endsAt.toISOString(),
      endsAt: new Date(block.endsAt.getTime() + afterMinutes * 60_000).toISOString(),
      relationshipId,
    });
}
function footprint(
  id: string,
  classification: CompositeFootprintIntervalV1["classification"],
  value: { startsAt: Date; endsAt: Date },
  relationshipId?: PlanningFactId,
): CompositeFootprintIntervalV1 {
  return {
    id,
    classification,
    startsAt: value.startsAt.toISOString(),
    endsAt: value.endsAt.toISOString(),
    ...(relationshipId ? { relationshipId } : {}),
  };
}
function interval(value: { startsAt: Date; endsAt: Date }) {
  return { startsAt: value.startsAt.toISOString(), endsAt: value.endsAt.toISOString() };
}
function sourceSemantic(value: CompositionTemplateSourceV1) {
  return {
    endpoint: endpointKey(value),
    durationMinutes: value.durationMinutes,
    revisionToken: value.revisionToken,
    recurrence: value.recurrence,
    bufferBeforeMinutes: value.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: value.bufferAfterMinutes ?? 0,
  };
}
function endpointKey(value: CommitmentEndpointV1) {
  return `${value.kind}|${value.sourceId}|${value.incarnationId}`;
}
function validateRelationship(value: unknown): value is AttachmentRelationshipV1 {
  return (
    record(value) &&
    value.recordType === "attachmentRelationship" &&
    value.version === 1 &&
    factId(value.id) &&
    positive(value.revision) &&
    (value.status === "active" || value.status === "retired") &&
    endpoint(value.parent) &&
    endpoint(value.child) &&
    typeof value.slot === "string" &&
    value.slot.length > 0 &&
    Number.isSafeInteger(value.order) &&
    applicability(value.applicability) &&
    (value.requiredness === "required" || value.requiredness === "optional") &&
    timing(value.timing) &&
    (value.timingStrictness === "constraint" || value.timingStrictness === "preference") &&
    buffer(value.buffer) &&
    (value.goalSupport === "none" || value.goalSupport === "supportForParentGoal") &&
    timestamp(value.createdAt) &&
    timestamp(value.updatedAt) &&
    timestamp(value.effectiveFrom) &&
    (value.status === "retired"
      ? value.effectiveTo === value.updatedAt
      : value.effectiveTo === undefined) &&
    record(value.provenance) &&
    value.provenance.role === "authoredAuthority"
  );
}
function validateDecision(value: unknown): value is CompositeDecisionV1 {
  return (
    record(value) &&
    value.recordType === "compositeDecision" &&
    value.version === 1 &&
    factId(value.id) &&
    positive(value.revision) &&
    (value.status === "active" || value.status === "retired") &&
    typeof value.compositeId === "string" &&
    typeof value.expectedFingerprint === "string" &&
    typeof value.parentOccurrenceId === "string" &&
    Array.isArray(value.deltas) &&
    value.deltas.every(
      (item) =>
        record(item) &&
        factId(item.relationshipId) &&
        (item.action === "omitOptional" ||
          (item.action === "offset" && Number.isSafeInteger(item.minutes))),
    ) &&
    timestamp(value.acceptedAt) &&
    timestamp(value.updatedAt) &&
    record(value.provenance) &&
    value.provenance.role === "acceptedAuthority"
  );
}
function endpoint(value: unknown): value is CommitmentEndpointV1 {
  return (
    record(value) &&
    value.kind === "template" &&
    typeof value.sourceId === "string" &&
    value.sourceId.length > 0 &&
    factId(value.incarnationId)
  );
}
function applicability(value: unknown) {
  return (
    record(value) &&
    (value.weekdays === undefined ||
      (Array.isArray(value.weekdays) &&
        value.weekdays.every((day) =>
          ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].includes(
            String(day),
          ),
        ))) &&
    (value.includeOccurrenceIds === undefined || stringArray(value.includeOccurrenceIds)) &&
    (value.excludeOccurrenceIds === undefined || stringArray(value.excludeOccurrenceIds)) &&
    (value.dateInterval === undefined ||
      (record(value.dateInterval) &&
        localDate(value.dateInterval.startUserDayDate) &&
        localDate(value.dateInterval.endUserDayDateExclusive) &&
        value.dateInterval.startUserDayDate < value.dateInterval.endUserDayDateExclusive))
  );
}
function timing(value: unknown) {
  if (!record(value)) return false;
  if (["endsAtParentStart", "startsAtParentEnd"].includes(String(value.kind))) return true;
  if (["beforeParentWithGap", "afterParentWithGap"].includes(String(value.kind)))
    return (
      record(value.gap) &&
      ["exact", "minimum"].includes(String(value.gap.kind)) &&
      nonnegative(value.gap.minutes)
    );
  return (
    ["offsetFromParentStart", "offsetFromParentEnd"].includes(String(value.kind)) &&
    ["componentStart", "componentEnd"].includes(String(value.anchor)) &&
    Number.isSafeInteger(value.offsetMinutes)
  );
}
function buffer(value: unknown) {
  return record(value) && nonnegative(value.beforeMinutes) && nonnegative(value.afterMinutes);
}
function validateHistories<T extends { id: PlanningFactId; revision: PlanningRevision }>(
  values: T[],
  issues: string[],
) {
  const grouped = new Map<string, T[]>();
  for (const value of values) grouped.set(value.id, [...(grouped.get(value.id) ?? []), value]);
  for (const [id, history] of grouped)
    if (
      [...history]
        .sort((a, b) => a.revision - b.revision)
        .some((item, index) => item.revision !== index + 1)
    )
      issues.push(`history:${id}`);
}
function latest<T extends { id: PlanningFactId; revision: PlanningRevision }>(values: T[]) {
  const map = new Map<PlanningFactId, T>();
  for (const value of values)
    if (!map.has(value.id) || map.get(value.id)!.revision < value.revision)
      map.set(value.id, value);
  return [...map.values()];
}
function compare(
  a: { id: PlanningFactId; revision: PlanningRevision },
  b: { id: PlanningFactId; revision: PlanningRevision },
) {
  return a.id.localeCompare(b.id) || a.revision - b.revision;
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function positive(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}
function nonnegative(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}
function timestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
function localDate(value: unknown): value is LocalDateString {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function factId(value: unknown): value is PlanningFactId {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value)
  );
}
function weekday(date: LocalDateString): Weekday {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
    new Date(`${date}T12:00:00Z`).getUTCDay()
  ] as Weekday;
}
function semanticFingerprint(value: unknown): string {
  const input = canonical(value);
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < input.length; index++) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, "0");
}
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}
