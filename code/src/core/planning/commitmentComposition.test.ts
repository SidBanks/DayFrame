import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { DraftScheduledBlock } from "../blocks/types.js";
import {
  projectCompositeOccurrence,
  validateCompositionAuthority,
  type AttachmentRelationshipV1,
  type CompositionTemplateSourceV1,
} from "./commitmentComposition.js";
import { planningRevision, type PlanningFactId } from "./planningFoundation.js";

const fact = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as PlanningFactId;
const parentInc = "11111111-1111-4111-8111-111111111111" as SourceIncarnationId;
const childInc = "22222222-2222-4222-8222-222222222222" as SourceIncarnationId;
const source = (
  sourceId: string,
  incarnationId: SourceIncarnationId,
  durationMinutes: number,
): CompositionTemplateSourceV1 => ({
  kind: "template",
  sourceId,
  incarnationId,
  title: sourceId,
  durationMinutes,
  revisionToken: "2026-09-04T12:00:00.000Z",
  userId: "u",
  category: "maintenance",
  priority: 3,
});
const sources = [source("parent", parentInc, 60), source("travel", childInc, 30)];
const relation = (patch: Partial<AttachmentRelationshipV1> = {}): AttachmentRelationshipV1 => ({
  recordType: "attachmentRelationship",
  version: 1,
  id: fact,
  revision: planningRevision(1),
  status: "active",
  parent: sources[0]!,
  child: sources[1]!,
  slot: "inbound",
  order: 0,
  applicability: {},
  requiredness: "required",
  timing: { kind: "endsAtParentStart" },
  timingStrictness: "constraint",
  buffer: { beforeMinutes: 0, afterMinutes: 10 },
  goalSupport: "none",
  createdAt: "2026-09-04T12:00:00.000Z",
  updatedAt: "2026-09-04T12:00:00.000Z",
  effectiveFrom: "2026-09-04T12:00:00.000Z",
  provenance: { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } },
  ...patch,
});
const parent: DraftScheduledBlock = {
  id: "parent-occurrence",
  userId: "u",
  templateId: "parent",
  source: "template",
  title: "Parent",
  category: "fitness",
  startsAt: new Date("2026-09-07T15:00:00.000Z"),
  endsAt: new Date("2026-09-07T16:00:00.000Z"),
  userDayDate: "2026-09-07",
  userWeekStartDate: "2026-09-06",
  priority: 3,
  status: "planned",
  externalResources: [],
};
const project = (
  relationship = relation(),
  occupied: Array<{ id: string; startsAt: Date; endsAt: Date }> = [],
) =>
  projectCompositeOccurrence({
    parent,
    parentSource: sources[0]!,
    sources,
    authority: { version: 1, relationships: [relationship], decisions: [] },
    planningWindow: {
      startsAt: new Date("2026-09-07T00:00:00Z"),
      endsAt: new Date("2026-09-08T00:00:00Z"),
    },
    occupied,
  });

describe("Commitment Composition V1", () => {
  it("validates incarnation-safe authority and rejects dangling endpoints", () => {
    expect(
      validateCompositionAuthority(
        { version: 1, relationships: [relation()], decisions: [] },
        sources,
      ).status,
    ).toBe("valid");
    expect(
      validateCompositionAuthority({ version: 1, relationships: [relation()], decisions: [] }, [
        sources[0]!,
      ]),
    ).toMatchObject({ status: "invalid", issues: [`dangling:${fact}`] });
  });
  it("pairs deterministically and classifies activity and protected Buffer without an envelope", () => {
    const first = project(),
      second = project();
    expect(first).toEqual(second);
    expect(first.state).toBe("fullyFeasible");
    expect(first.attachedOccurrences[0]).toMatchObject({
      title: "travel",
      startsAt: new Date("2026-09-07T14:30:00Z"),
      endsAt: new Date("2026-09-07T15:00:00Z"),
    });
    expect(first.footprint.map((item) => item.classification)).toEqual([
      "parentCore",
      "supportActivity",
      "buffer",
    ]);
  });
  it("creates required liability but only explicit optional omission for collision", () => {
    const occupied = [
      {
        id: "conflict",
        startsAt: new Date("2026-09-07T14:30:00Z"),
        endsAt: new Date("2026-09-07T14:45:00Z"),
      },
    ];
    expect(project(relation(), occupied)).toMatchObject({
      state: "requiredComponentFailure",
      liabilities: [{ reason: "conflict", requiredMinutes: 30 }],
    });
    expect(project(relation({ requiredness: "optional" }), occupied)).toMatchObject({
      state: "feasibleWithoutOptional",
      liabilities: [],
      omittedOptionalRelationshipIds: [fact],
    });
  });
  it("supports bounded weekday applicability without copying recurrence", () => {
    expect(
      project(relation({ applicability: { weekdays: ["monday"] } })).attachedOccurrences,
    ).toHaveLength(1);
    expect(
      project(relation({ applicability: { weekdays: ["tuesday"] } })).attachedOccurrences,
    ).toHaveLength(0);
  });
  it("protects the deduplicated maximum of source-local and relationship buffers", () => {
    const bufferedSources = [sources[0]!, { ...sources[1]!, bufferAfterMinutes: 20 }];
    const result = projectCompositeOccurrence({
      parent,
      parentSource: bufferedSources[0]!,
      sources: bufferedSources,
      authority: { version: 1, relationships: [relation()], decisions: [] },
      planningWindow: {
        startsAt: new Date("2026-09-07T00:00:00Z"),
        endsAt: new Date("2026-09-08T00:00:00Z"),
      },
      occupied: [
        {
          id: "buffer-conflict",
          startsAt: new Date("2026-09-07T15:10:00Z"),
          endsAt: new Date("2026-09-07T15:15:00Z"),
        },
      ],
    });
    expect(result).toMatchObject({
      state: "requiredComponentFailure",
      liabilities: [{ reason: "conflict" }],
      footprint: [
        expect.objectContaining({ classification: "parentCore" }),
        expect.objectContaining({ classification: "requiredLiability" }),
      ],
    });
  });
  it("rejects stale decisions without partially applying their deltas", () => {
    const base = project();
    const decision = {
      recordType: "compositeDecision" as const,
      version: 1 as const,
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" as PlanningFactId,
      revision: planningRevision(1),
      status: "active" as const,
      compositeId: base.compositeId,
      expectedFingerprint: "stale",
      parentOccurrenceId: parent.id,
      deltas: [{ relationshipId: fact, action: "offset" as const, minutes: 15 }],
      acceptedAt: "2026-09-04T12:00:00.000Z",
      updatedAt: "2026-09-04T12:00:00.000Z",
      provenance: {
        version: 1 as const,
        role: "acceptedAuthority" as const,
        origin: { kind: "directAuthoring" as const },
      },
    };
    const result = projectCompositeOccurrence({
      parent,
      parentSource: sources[0]!,
      sources,
      authority: { version: 1, relationships: [relation()], decisions: [decision] },
      planningWindow: {
        startsAt: new Date("2026-09-07T00:00:00Z"),
        endsAt: new Date("2026-09-08T00:00:00Z"),
      },
    });
    expect(result).toMatchObject({ state: "stale", attachedOccurrences: [] });
  });
});
