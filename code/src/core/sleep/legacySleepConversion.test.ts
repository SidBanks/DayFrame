import { expect, it } from "vitest";
import { conversionFixture } from "./legacySleepConversionTestFixtures.js";
import {
  discoverLegacySleep,
  reviewLegacySleep,
  stageLegacySleepConversion,
} from "./legacySleepConversion.js";
import type { ConversionContext, ConversionRequest } from "./legacySleepConversion.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";
import { queryEffectiveSleepRequirement } from "./sleepRequirement.js";
import { createCurrentActive, readCurrentActive } from "../../state/activeV4.js";
import { instantiateActiveSetup, projectActiveToPattern } from "../../state/activeV2.js";
import { requirement } from "./sleepTestFixtures.js";
import { createSourceIncarnationId } from "../authored/sourceIncarnation.js";
function command(context: ConversionContext, request: ConversionRequest) {
  return {
    request,
    expectedFingerprint: reviewLegacySleep(context, request).fingerprint,
    commandId: createSourceIncarnationId(),
    confirmed: true as const,
  };
}
it("discovers category/title/default identity independently without mutation or inferred authority", () => {
  const { context } = conversionFixture(),
    before = structuredClone(context.setup);
  expect(discoverLegacySleep(context.setup)).toHaveLength(1);
  expect(context.setup).toEqual(before);
  expect(context.setup.sleepRequirements ?? []).toEqual([]);
  for (const hint of ["category", "title", "id"]) {
    const t = context.setup.blockTemplates[0]!;
    Object.assign(t, {
      id: hint === "id" ? "default_sleep" : "other",
      title: hint === "title" ? "Sleep" : "Recovery",
      category: hint === "category" ? "sleep" : "recovery",
    });
    context.setup.blockRecurrences[0]!.blockTemplateId = t.id;
    expect(discoverLegacySleep(context.setup)).toHaveLength(1);
  }
  context.setup.blockTemplates[0]!.id = "recovery";
  context.setup.blockRecurrences[0]!.blockTemplateId = "recovery";
  expect(discoverLegacySleep(context.setup)).toEqual([]);
});
it("review is deterministic, read-only and explicit confirmation is required", () => {
  const { context, request } = conversionFixture();
  const before = structuredClone(context);
  const r = reviewLegacySleep(context, request);
  expect(r.status).toBe("convertible");
  expect(reviewLegacySleep(context, request)).toEqual(r);
  expect(context).toEqual(before);
  expect(() =>
    stageLegacySleepConversion(
      context,
      { ...command(context, request), confirmed: false as never },
      createSourceIncarnationId,
    ),
  ).toThrow();
  expect(context).toEqual(before);
});
it.each(["00:00", "03:00", "12:00"] as const)(
  "cuts over exactly by owner day at boundary %s",
  (boundary) => {
    const { context, request } = conversionFixture();
    context.setup.schedulingPreferences.dayBoundaryStartTime = boundary;
    const result = stageLegacySleepConversion(
      context,
      command(context, request),
      createSourceIncarnationId,
    );
    expect(result.setup.blockRecurrences[0]!.endsOnDate).toBe("2026-09-30");
    const days = generateBlockCandidates({
      ...result.setup,
      planningWindowStart: new Date("2026-09-30T00:00:00"),
      planningWindowEnd: new Date("2026-10-03T00:00:00"),
      dayBoundaryStartTime: boundary,
      defaultSchedulingPreferences: result.setup.schedulingPreferences,
    }).map((c) => c.userDayDate);
    expect(days).toContain("2026-09-30");
    expect(days.some((d) => d >= "2026-10-01")).toBe(false);
    expect(
      queryEffectiveSleepRequirement(result.setup.sleepRequirements, "2026-09-30").status,
    ).toBe("notApplicable");
    expect(
      queryEffectiveSleepRequirement(result.setup.sleepRequirements, "2026-10-01").status,
    ).toBe("effective");
    expect(
      queryEffectiveSleepRequirement(result.setup.sleepRequirements, "2026-10-02").status,
    ).toBe("effective");
  },
);
it.each(["beforeWork", "afterWork"] as const)(
  "requires and preserves complete explicit %s intent",
  (kind) => {
    const { context, request } = conversionFixture();
    context.setup.blockTemplates[0]!.preferredWindow = kind;
    delete context.setup.blockTemplates[0]!.customWindowStartTime;
    delete context.setup.blockTemplates[0]!.customWindowEndTime;
    expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
    request.intent = {
      enabled: true,
      effectiveFrom: request.cutover,
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 20,
      window: {
        kind,
        spanMinutes: 600,
        offDay: { startClock: "22:00", endClock: "08:00", preferredStartClock: "23:00" },
      },
    };
    const out = stageLegacySleepConversion(
      context,
      command(context, request),
      createSourceIncarnationId,
    );
    expect(out.setup.sleepRequirements![0]).toMatchObject(request.intent!);
    expect(out.conversion).not.toHaveProperty("priority");
  },
);
it("preserves dated weekday intent and exact buffers without reducing protection", () => {
  const { context, request } = conversionFixture();
  Object.assign(context.setup.blockRecurrences[0]!, {
    frequency: "specificWeekdays",
    weekdays: ["monday", "wednesday"],
    endsOnDate: "2026-10-31",
  });
  const r = reviewLegacySleep(context, request);
  expect(r.proposed).toMatchObject({
    effectiveFrom: "2026-10-01",
    effectiveUntilExclusive: "2026-11-01",
    weekdays: ["monday", "wednesday"],
    durationMinutes: 120,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 20,
  });
  request.intent = { ...r.proposed!, bufferAfterMinutes: 0 };
  expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
});
it.each(["weekly", "timesPerUserWeek", "custom", "perShiftSegment"] as const)(
  "does not approximate %s recurrence",
  (frequency) => {
    const { context, request } = conversionFixture();
    context.setup.blockRecurrences[0]!.frequency = frequency;
    expect(["unsupported", "protected"]).toContain(reviewLegacySleep(context, request).status);
  },
);
it.each(["disabled", "future", "revisions"])(
  "does not merge existing %s First-Class Sleep",
  (mode) => {
    const { context, request } = conversionFixture();
    const r = requirement();
    if (mode === "disabled") r.enabled = false;
    if (mode === "future") r.effectiveFrom = "2027-01-01";
    context.setup.sleepRequirements = [r];
    if (mode === "revisions")
      context.setup.sleepRequirements.push({
        ...r,
        revision: 2,
        effectiveFrom: "2026-10-02",
        updatedAt: "2026-09-02T00:00:00.000Z",
      });
    expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
  },
);
it("blocks resources, missing windows, multiple future recurrence and protected evidence", () => {
  for (const what of ["resource", "window", "recurrence", "protected"]) {
    const { context, request } = conversionFixture();
    if (what === "resource") context.setup.blockTemplates[0]!.requiresResource = true;
    if (what === "window") context.setup.blockTemplates[0]!.preferredWindow = "anyAvailable";
    if (what === "recurrence")
      context.setup.blockRecurrences.push({
        ...context.setup.blockRecurrences[0]!,
        id: "other",
        incarnationId: createSourceIncarnationId(),
      });
    if (what === "protected") context.historyReady = false;
    expect(reviewLegacySleep(context, request).status).not.toBe("convertible");
  }
});
it("is idempotent, allocates fresh lifetimes, and rejects changed request or source lifetime", () => {
  const { context, request } = conversionFixture();
  const input = command(context, request);
  const out = stageLegacySleepConversion(context, input, createSourceIncarnationId);
  context.setup = out.setup;
  expect(
    stageLegacySleepConversion(context, input, () => {
      throw Error("must not allocate");
    }).status,
  ).toBe("alreadyConverted");
  expect(context.setup.legacySleepConversions).toHaveLength(1);
  expect(out.conversion.requirement.incarnationId).not.toBe(
    request.selection.templateIncarnationId,
  );
  expect(() =>
    stageLegacySleepConversion(
      context,
      { ...input, request: { ...request, cutover: "2026-10-02" } },
      createSourceIncarnationId,
    ),
  ).toThrow();
  const fresh = conversionFixture();
  const stale = command(fresh.context, fresh.request);
  fresh.context.setup.blockRecurrences[0]!.incarnationId = createSourceIncarnationId();
  expect(() =>
    stageLegacySleepConversion(fresh.context, stale, createSourceIncarnationId),
  ).toThrow();
});
it("profiles project portable retirement and fresh Sleep lifetime without live conversion lineage", () => {
  const { context, request } = conversionFixture();
  const out = stageLegacySleepConversion(
    context,
    command(context, request),
    createSourceIncarnationId,
  );
  const pattern = projectActiveToPattern(out.setup);
  expect(pattern).not.toHaveProperty("legacySleepConversions");
  const active = instantiateActiveSetup(pattern, createSourceIncarnationId);
  expect(active.blockRecurrences[0]!.endsOnDate).toBe("2026-09-30");
  expect(active.sleepRequirements![0]!.incarnationId).not.toBe(
    out.conversion.requirement.incarnationId,
  );
});
it.each(["missingSleep", "wrongLifetime", "missingSource", "retirement", "version", "fingerprint"])(
  "protects malformed %s aggregate and roundtrips exact valid lineage",
  (mode) => {
    const { context, request } = conversionFixture();
    const out = stageLegacySleepConversion(
      context,
      command(context, request),
      createSourceIncarnationId,
    );
    const envelope = createCurrentActive(out.setup);
    expect(envelope.version).toBe(4);
    expect(readCurrentActive(JSON.parse(JSON.stringify(envelope)))).toEqual(envelope);
    const bad = structuredClone(out.setup);
    if (mode === "missingSleep") bad.sleepRequirements = [];
    if (mode === "wrongLifetime")
      bad.sleepRequirements![0]!.incarnationId = createSourceIncarnationId();
    if (mode === "missingSource") bad.blockTemplates = [];
    if (mode === "retirement") delete bad.blockRecurrences[0]!.endsOnDate;
    if (mode === "version") bad.legacySleepConversions![0]!.version = 2 as never;
    if (mode === "fingerprint") bad.legacySleepConversions![0]!.mappingFingerprint = "broken";
    expect(() => createCurrentActive(bad)).toThrow();
  },
);
it("staging failures at every ID allocation never mutate source authority", () => {
  for (let failure = 1; failure <= 3; failure++) {
    const { context, request } = conversionFixture(),
      before = structuredClone(context);
    let calls = 0;
    expect(() =>
      stageLegacySleepConversion(context, command(context, request), () => {
        if (++calls === failure) throw Error("allocation");
        return createSourceIncarnationId();
      }),
    ).toThrow();
    expect(context).toEqual(before);
  }
});
it("blocks future accepted omit/move/priority/duration and leaves historical decisions untouched", () => {
  for (const kind of [
    "omitOccurrence",
    "placeOccurrence",
    "setOccurrencePriority",
    "setOccurrenceDuration",
  ] as const) {
    const { context, request } = conversionFixture();
    const t = context.setup.blockTemplates[0]!,
      r = context.setup.blockRecurrences[0]!;
    const target = {
      version: 1 as const,
      sourceKind: "template" as const,
      template: { id: t.id, incarnationId: t.incarnationId },
      recurrence: { id: r.id, incarnationId: r.incarnationId },
      coordinate: {
        frequency: "daily" as const,
        scopeKind: "userDay" as const,
        userDayDate: request.cutover,
        slot: 0,
      },
    };
    const decision = {
      version: 1,
      id: createSourceIncarnationId(),
      kind,
      target,
      payload:
        kind === "placeOccurrence"
          ? { userDayDate: request.cutover, startTime: "22:00" }
          : kind === "setOccurrencePriority"
            ? { priority: 2 }
            : kind === "setOccurrenceDuration"
              ? { durationMinutes: 90 }
              : {},
      acceptedAt: context.now,
      provenance: { source: "user" },
    } as unknown as import("../decisions/planDecision.js").PlanDecisionV1;
    context.authority.planDecisions = [decision];
    const before = structuredClone(context);
    expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
    expect(context).toEqual(before);
    target.coordinate.userDayDate = "2026-09-25";
    if (kind === "placeOccurrence")
      expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
    else expect(reviewLegacySleep(context, request).status).toBe("convertible");
  }
});
it("multiple candidates stay distinct and unrelated future legacy Sleep can coexist", () => {
  const { context, request } = conversionFixture();
  context.setup.blockTemplates.push({
    ...context.setup.blockTemplates[0]!,
    id: "other-sleep",
    incarnationId: createSourceIncarnationId(),
  });
  context.setup.blockRecurrences.push({
    ...context.setup.blockRecurrences[0]!,
    id: "other-recurrence",
    incarnationId: createSourceIncarnationId(),
    blockTemplateId: "other-sleep",
  });
  expect(discoverLegacySleep(context.setup)).toHaveLength(2);
  const out = stageLegacySleepConversion(
    context,
    command(context, request),
    createSourceIncarnationId,
  );
  expect(out.setup.blockRecurrences[1]).toEqual(context.setup.blockRecurrences[1]);
});
it("rejects past/current cutover and dates beyond the source’s applicability", () => {
  for (const day of ["2026-09-01", "2026-09-20", "2026-12-01"] as const) {
    const { context, request } = conversionFixture();
    context.setup.blockRecurrences[0]!.endsOnDate = "2026-11-01";
    request.cutover = day;
    expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
  }
});
it("requires a legal window for a fixed preferred clock instead of inventing one", () => {
  const { context, request } = conversionFixture();
  const t = context.setup.blockTemplates[0]!;
  t.placementType = "fixed";
  t.fixedStartTime = "22:00";
  t.preferredWindow = "anyAvailable";
  delete t.customWindowStartTime;
  delete t.customWindowEndTime;
  expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
});
it.each([
  ["Day", "Evening"],
  ["Evening", "Night"],
  ["Night", "Day"],
  ["Work", "Off"],
  ["Off", "Work"],
] as const)("keeps owner-day identity stable at %s → %s", (before, after) => {
  const { context, request } = conversionFixture();
  const clocks = {
    Day: ["07:00", "15:00"],
    Evening: ["15:00", "23:00"],
    Night: ["23:00", "07:00"],
    Work: ["09:00", "17:00"],
  } as const;
  const pattern = projectActiveToPattern(context.setup);
  pattern.shiftDefinitions = Object.entries(clocks).map(([name, [startTime, endTime]]) => ({
    id: name,
    userId: "u",
    name,
    startTime,
    endTime,
    crossesMidnight: endTime < startTime,
    workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    createdAt: context.now,
    updatedAt: context.now,
  }));
  pattern.shiftCycles = [
    {
      id: "cycle",
      userId: "u",
      name: "Transition",
      type: "fixedSegments",
      mode: "repeatingSequence",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-11-01",
      sequenceAnchorDate: "2026-09-30",
      segments: [],
      sequence: [
        { id: "before", dayOffset: 0, shiftDefinitionId: before === "Off" ? null : before },
        { id: "after", dayOffset: 1, shiftDefinitionId: after === "Off" ? null : after },
      ],
      createdAt: context.now,
      updatedAt: context.now,
    },
  ];
  context.setup = instantiateActiveSetup(pattern, createSourceIncarnationId);
  request.selection = discoverLegacySleep(context.setup)[0]!.selection;
  const out = stageLegacySleepConversion(
    context,
    command(context, request),
    createSourceIncarnationId,
  );
  expect(out.conversion.cutover).toBe("2026-10-01");
  expect(out.setup.sleepRequirements![0]!.effectiveFrom).toBe("2026-10-01");
  expect(out.setup.blockRecurrences[0]!.endsOnDate).toBe("2026-09-30");
  expect(out.setup.shiftCycles).toEqual(context.setup.shiftCycles);
});
it("preserves live lineage after later edits, rejects recurrence reopening and pre-cutover Sleep revisions", () => {
  const { context, request } = conversionFixture();
  const out = stageLegacySleepConversion(
    context,
    command(context, request),
    createSourceIncarnationId,
  );
  const changed = structuredClone(out.setup);
  changed.sleepRequirements!.push({
    ...changed.sleepRequirements![0]!,
    revision: 2,
    effectiveFrom: "2026-09-29",
    updatedAt: "2026-09-21T00:00:00.000Z",
  });
  expect(() => createCurrentActive(changed)).toThrow();
  const reopened = structuredClone(out.setup);
  reopened.blockRecurrences[0]!.endsOnDate = "2026-10-31";
  expect(() => createCurrentActive(reopened)).toThrow();
});
it("active attachments are unsupported and retained realized legacy support blocks cutover without mutation", async () => {
  const { context, request } = conversionFixture();
  const t = context.setup.blockTemplates[0]!;
  const endpoint = { kind: "template" as const, sourceId: t.id, incarnationId: t.incarnationId };
  const relation: import("../planning/commitmentComposition.js").AttachmentRelationshipV1 = {
    recordType: "attachmentRelationship",
    version: 1,
    id: createSourceIncarnationId() as never,
    revision: 1 as never,
    status: "active",
    parent: endpoint,
    child: { ...endpoint, sourceId: "support", incarnationId: createSourceIncarnationId() },
    slot: "support",
    order: 0,
    applicability: {},
    requiredness: "required",
    timing: { kind: "endsAtParentStart" },
    timingStrictness: "constraint",
    buffer: { beforeMinutes: 0, afterMinutes: 0 },
    goalSupport: "none",
    createdAt: context.now,
    updatedAt: context.now,
    effectiveFrom: context.now,
    provenance: { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } },
  };
  context.authority.composition.authority.relationships = [relation];
  expect(reviewLegacySleep(context, request).status).toBe("unsupported");
  context.authority.composition.authority.relationships.push({
    ...relation,
    revision: 2 as never,
    status: "retired",
  });
  expect(reviewLegacySleep(context, request).status).toBe("convertible");
  const { capacityFingerprint } = await import("../planning/capacityFingerprint.js");
  const { validateRealizedScheduleFact, REALIZED_SCHEDULE_IDENTITY_POLICY_V1 } =
    await import("../planning/realizedScheduleIdentity.js");
  const origin = {
    kind: "acceptedAllocation",
    realizationId: "realized",
    acceptedAllocationId: "accepted",
    acceptedAllocationRevision: 1,
    acceptedClaimId: "claim",
    proposalDecisionId: "decision",
    proposalId: "proposal",
    proposalRevision: 1,
    proposalOptionId: "option",
  };
  const raw = {
    recordType: "realizedScheduleFact",
    version: 1,
    id: capacityFingerprint({
      policy: REALIZED_SCHEDULE_IDENTITY_POLICY_V1,
      realizationId: origin.realizationId,
      acceptedAllocationId: origin.acceptedAllocationId,
      acceptedAllocationRevision: 1,
      acceptedClaimId: origin.acceptedClaimId,
      scheduleRole: "supportActivity",
    }),
    sourceKind: "acceptedAllocation",
    scheduleRole: "supportActivity",
    origin,
    startsAt: "2026-10-01T22:00:00.000Z",
    endsAt: "2026-10-02T00:00:00.000Z",
    durationMinutes: 120,
    userDayDate: request.cutover,
    capacityIntervalId: "capacity",
    placement: "fixedAcceptedGeometry",
    recurrence: "none",
    autonomousMovability: "prohibited",
    lineage: {
      candidateParentId: "parent",
      goalId: "goal",
      demandId: "demand",
      demandRevision: 1,
      demandProjectionId: "projection",
      productiveOpportunityId: "opportunity",
      requiredness: "required",
      relationship: { kind: "productiveRoot" },
      source: {
        kind: "compositionRelationship",
        relationshipId: relation.id,
        relationshipRevision: 1,
        parent: { sourceId: t.id, incarnationId: t.incarnationId },
        child: { sourceId: relation.child.sourceId, incarnationId: relation.child.incarnationId },
        slot: "support",
        semanticsFingerprint: "source",
      },
    },
    timeSemantics: "activity",
    executionEligibility: "eligible",
  };
  const fact = validateRealizedScheduleFact(raw);
  expect(fact.status).toBe("valid");
  if (fact.status !== "valid") throw Error(JSON.stringify(fact));
  context.authority.realizedFacts = [fact.fact];
  const before = structuredClone(context);
  expect(reviewLegacySleep(context, request).status).toBe("requiresReview");
  expect(context).toEqual(before);
});
it("does not approximate conditional Work-anchor applicability", () => {
  const { context, request } = conversionFixture();
  context.setup.blockTemplates[0]!.requiresWorkAnchor = true;
  expect(reviewLegacySleep(context, request).status).toBe("unsupported");
});
