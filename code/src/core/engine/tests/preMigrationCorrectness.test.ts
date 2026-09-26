import { describe, expect, it } from "vitest";
import {
  generateSchedulePreview,
  type GenerateSchedulePreviewInput,
} from "../generateSchedulePreview.js";
import { reviseSchedulePreview } from "../reviseSchedulePreview.js";
import { createPlanDecisionAcceptanceCandidate } from "../../decisions/createPlanDecisionAcceptanceCandidate.js";
import type { DayFrameAuthoredSetup } from "../../../state/types.js";
import type { RealizedScheduleFactV1 } from "../../planning/realizedScheduleIdentity.js";

const stamp = { createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" };
const incarnationId =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as import("../../authored/sourceIncarnation.js").SourceIncarnationId;
function fixture(boundary: "00:00" | "03:00" | "12:00" = "03:00") {
  const setup: DayFrameAuthoredSetup = {
    previewRange: { preset: "custom", startDate: "2026-05-04", endDate: "2026-05-06" },
    schedulingPreferences: { dayBoundaryStartTime: boundary, weekStartsOn: "monday" },
    shiftDefinitions: [
      {
        id: "work",
        incarnationId,
        userId: "user",
        name: "Work",
        startTime: "07:00",
        endTime: "15:00",
        crossesMidnight: false,
        workDays: ["monday", "tuesday", "wednesday"],
        ...stamp,
      },
    ],
    shiftCycles: [
      {
        id: "cycle",
        incarnationId,
        userId: "user",
        name: "Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment",
            incarnationId,
            shiftCycleId: "cycle",
            shiftDefinitionId: "work",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...stamp,
      },
    ],
    blockTemplates: [
      {
        id: "sleep",
        incarnationId,
        userId: "user",
        title: "Sleep",
        category: "sleep",
        placementType: "flexible",
        durationMinutes: 480,
        bufferBeforeMinutes: 30,
        bufferAfterMinutes: 30,
        priority: 1,
        preferredWindow: "custom",
        customWindowStartTime: "22:00",
        customWindowEndTime: "08:00",
        rescheduleBehavior: "askUser",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...stamp,
      },
    ],
    blockRecurrences: [
      { id: "daily", incarnationId, blockTemplateId: "sleep", frequency: "daily" },
    ],
    manualEvents: [],
  };
  const input: GenerateSchedulePreviewInput = {
    ...setup,
    ...setup.schedulingPreferences,
    planningWindowStart: new Date(2026, 4, 4, Number(boundary.slice(0, 2))),
    planningWindowEnd: new Date(2026, 4, 7, Number(boundary.slice(0, 2))),
    generatedAt: stamp.createdAt,
  };
  return { setup, input };
}
function unplacedPreview() {
  const { setup, input } = fixture();
  // A deliberately impossible authored window creates a real unplaced occurrence.
  setup.blockTemplates[0]!.customWindowStartTime = "04:00";
  setup.blockTemplates[0]!.customWindowEndTime = "05:00";
  const original = generateSchedulePreview(input);
  const point = original.frictionPoints.find((p) =>
    p.affectedBlockIds.includes(
      original.unplacedCandidates.find((c) => c.userDayDate === "2026-05-04")!.id,
    ),
  )!;
  const fix = point.suggestedFixes.find((f) => f.action === "moveBlock")!;
  return { setup, input, original, point, fix };
}
function move(value: ReturnType<typeof unplacedPreview>) {
  return reviseSchedulePreview({
    preview: value.original,
    selectedFrictionPointId: value.point.id,
    selectedSuggestedFixId: value.fix.id,
    dayBoundaryStartTime: "03:00",
    revisedAt: stamp.updatedAt,
  });
}
function fact(role: RealizedScheduleFactV1["scheduleRole"]): RealizedScheduleFactV1 {
  const base = {
    id: role as RealizedScheduleFactV1["id"],
    recordType: "realizedScheduleFact" as const,
    version: 1 as const,
    sourceKind: "acceptedAllocation" as const,
    startsAt: new Date(2026, 4, 4, 15).toISOString(),
    endsAt: new Date(2026, 4, 4, 22).toISOString(),
    userDayDate: "2026-05-04" as const,
    durationMinutes: 420,
    capacityIntervalId: "capacity",
    placement: "fixedAcceptedGeometry" as const,
    recurrence: "none" as const,
    autonomousMovability: "prohibited" as const,
    origin: {
      kind: "acceptedAllocation" as const,
      realizationId: "realization" as RealizedScheduleFactV1["origin"]["realizationId"],
      acceptedAllocationId: "accepted",
      acceptedAllocationRevision: 1,
      acceptedClaimId: role,
      proposalDecisionId: "decision",
      proposalId: "proposal",
      proposalRevision: 1,
      proposalOptionId: "option",
    },
    lineage: {
      candidateParentId: "parent",
      goalId: "goal" as RealizedScheduleFactV1["lineage"]["goalId"],
      demandId: "demand" as RealizedScheduleFactV1["lineage"]["demandId"],
      demandRevision: 1 as RealizedScheduleFactV1["lineage"]["demandRevision"],
      demandProjectionId: "projection",
      productiveOpportunityId: "opportunity",
      requiredness: "required" as const,
      source: { kind: "direct" as const },
      relationship: { kind: "productiveRoot" as const },
    },
  };
  return role === "bufferProtection"
    ? {
        ...base,
        scheduleRole: role,
        timeSemantics: "protection",
        executionEligibility: "prohibited",
      }
    : { ...base, scheduleRole: role, timeSemantics: "activity", executionEligibility: "eligible" };
}
describe("Task 9.9 corrective physical geometry", () => {
  it("advances beyond future locked Work when the full footprint cannot fit before it", () => {
    const f = unplacedPreview(),
      result = move(f);
    const b = result.preview.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04")!;
    expect(result.didRevise).toBe(true);
    expect(b.startsAt).toEqual(new Date(2026, 4, 4, 15, 30));
    expect(b.endsAt).toEqual(new Date(2026, 4, 4, 23, 30));
  });
  it.each(["productiveGoalWork", "supportActivity", "bufferProtection"] as const)(
    "preserves and respects %s, including no-fit",
    (role) => {
      const f = unplacedPreview();
      f.original.realizedScheduleFacts = [fact(role)];
      const before = structuredClone(f.original.realizedScheduleFacts),
        result = move(f);
      expect(result.didRevise).toBe(false);
      expect(result.preview.unplacedCandidates.some((c) => c.userDayDate === "2026-05-04")).toBe(
        true,
      );
      expect(result.preview.realizedScheduleFacts).toEqual(before);
      expect(f.original.realizedScheduleFacts).toEqual(before);
    },
  );
  it("successful unrelated revision preserves all realized roles", () => {
    const f = unplacedPreview();
    f.original.realizedScheduleFacts = [
      "productiveGoalWork",
      "supportActivity",
      "bufferProtection",
    ].map((role) => ({
      ...fact(role as RealizedScheduleFactV1["scheduleRole"]),
      startsAt: new Date(2026, 4, 4, 7).toISOString(),
      endsAt: new Date(2026, 4, 4, 8).toISOString(),
    }));
    const before = structuredClone(f.original.realizedScheduleFacts),
      result = move(f);
    expect(result.didRevise).toBe(true);
    expect(result.preview.realizedScheduleFacts).toEqual(before);
    expect(result.preview.realizedScheduleFacts).not.toBe(f.original.realizedScheduleFacts);
  });
  it("maps the moved candidate by semantic occurrence rather than generated block ID", () => {
    const f = unplacedPreview(),
      revised = move(f).preview;
    const mapped = createPlanDecisionAcceptanceCandidate({
      suggestedFix: f.fix,
      frictionPoint: f.point,
      originalPreview: f.original,
      revisedPreview: revised,
      authoredSetup: f.setup,
    });
    expect(mapped).toMatchObject({
      status: "supported",
      candidate: {
        kind: "placeOccurrence",
        payload: { userDayDate: "2026-05-04", startTime: "15:30" },
      },
    });
  });
});
describe("Task 9.9 overnight custom Sleep", () => {
  it.each(["00:00", "12:00"] as const)(
    "preserves owner and full physical footprint at %s",
    (boundary) => {
      const { input } = fixture(boundary);
      const result = generateSchedulePreview(input);
      const blocks = result.scheduledBlocks.filter(
        (b) => b.userDayDate >= "2026-05-04" && b.userDayDate <= "2026-05-05",
      );
      expect(blocks).toHaveLength(2);
      for (const b of blocks) {
        expect(b.startsAt.getHours()).toBe(22);
        expect(b.startsAt.getMinutes()).toBe(30);
        expect(b.endsAt.getHours()).toBe(6);
        expect(b.endsAt.getMinutes()).toBe(30);
        expect(b.startsAt.getDate()).toBe(Number(b.userDayDate.slice(-2)));
        expect(b.endsAt.getDate()).toBe(b.startsAt.getDate() + 1);
        expect(
          result.generatedWorkBlocks.some(
            (w) =>
              b.startsAt.getTime() - 30 * 60000 < w.endsAt.getTime() &&
              b.endsAt.getTime() + 30 * 60000 > w.startsAt.getTime(),
          ),
        ).toBe(false);
      }
      expect(
        new Set(result.scheduledBlocks.map((b) => JSON.stringify(b.occurrenceIdentity))).size,
      ).toBe(result.scheduledBlocks.length);
    },
  );
});

describe("Task 9.9 placement guards", () => {
  it("uses a valid opening before Work for a smaller full footprint", () => {
    const f = unplacedPreview();
    f.original.unplacedCandidates.find((c) => c.userDayDate === "2026-05-04")!.durationMinutes = 60;
    const b = move(f).preview.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04")!;
    expect(b.startsAt).toEqual(new Date(2026, 4, 4, 3, 30));
    expect(b.endsAt).toEqual(new Date(2026, 4, 4, 4, 30));
  });
  it("respects physical Work spill from another owner", () => {
    const f = unplacedPreview();
    f.original.generatedWorkBlocks.push({
      ...f.original.generatedWorkBlocks[0]!,
      id: "spill",
      userDayDate: "2026-05-03",
      startsAt: new Date(2026, 4, 4, 15),
      endsAt: new Date(2026, 4, 4, 22),
    });
    expect(move(f).didRevise).toBe(false);
  });
  it("respects scheduled manual/fixed occupancy and its buffers", () => {
    const f = unplacedPreview(),
      result = move(f);
    const block = result.preview.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04")!;
    f.original.scheduledBlocks.push({
      ...block,
      id: "manual",
      source: "manual",
      placementType: "fixed",
      startsAt: new Date(2026, 4, 4, 15),
      endsAt: new Date(2026, 4, 4, 16),
      bufferAfterMinutes: 120,
    });
    const moved = move(f).preview.scheduledBlocks.find(
      (b) => b.templateId === "sleep" && b.id !== "manual" && b.userDayDate === "2026-05-04",
    )!;
    expect(moved.startsAt).toEqual(new Date(2026, 4, 4, 18, 30));
    f.original.scheduledBlocks[0]!.status = "skipped";
    expect(
      move(f).preview.scheduledBlocks.find(
        (b) => b.id !== "manual" && b.userDayDate === "2026-05-04",
      )!.startsAt,
    ).toEqual(new Date(2026, 4, 4, 15, 30));
  });
  it.each(["unchanged", "different", "overlap", "ambiguous"] as const)(
    "rejects %s Try evidence",
    (kind) => {
      const f = unplacedPreview(),
        revised = kind === "unchanged" ? structuredClone(f.original) : move(f).preview;
      const b = revised.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04");
      if (b && kind === "different")
        b.occurrenceIdentity = {
          ...b.occurrenceIdentity!,
          sourceKind: "template",
          frequency: "daily",
          scopeKind: "userDay",
          templateId: "sleep",
          recurrenceId: "daily",
          userDayDate: "2026-05-05",
          slot: 0,
        };
      if (b && kind === "overlap") {
        b.startsAt = new Date(2026, 4, 4, 3, 30);
        b.endsAt = new Date(2026, 4, 4, 11, 30);
      }
      if (b && kind === "ambiguous") revised.scheduledBlocks.push({ ...b, id: "other" });
      expect(
        createPlanDecisionAcceptanceCandidate({
          suggestedFix: f.fix,
          frictionPoint: f.point,
          originalPreview: f.original,
          revisedPreview: revised,
          authoredSetup: f.setup,
        }).status,
      ).not.toBe("supported");
    },
  );
  it("does not place overnight custom Sleep inside blocking Work", () => {
    const { input } = fixture("00:00");
    input.shiftDefinitions[0]!.startTime = "22:00";
    input.shiftDefinitions[0]!.endTime = "06:00";
    input.shiftDefinitions[0]!.crossesMidnight = true;
    const result = generateSchedulePreview(input);
    expect(result.unplacedCandidates.some((c) => c.userDayDate === "2026-05-04")).toBe(true);
    expect(result.scheduledBlocks.some((c) => c.userDayDate === "2026-05-04")).toBe(false);
  });
  it("preserves overnight custom owner through variable segment boundaries", () => {
    const { input } = fixture("12:00");
    const cycle = input.shiftCycles![0]!,
      first = cycle.segments[0]!;
    first.endsOnDate = "2026-05-04";
    first.schedulePreferences = { dayBoundaryStartTime: "12:00" };
    cycle.segments.push({
      ...first,
      id: "next",
      startsOnDate: "2026-05-05",
      endsOnDate: "2026-05-31",
      schedulePreferences: { dayBoundaryStartTime: "00:00" },
    });
    const result = generateSchedulePreview(input);
    for (const day of ["2026-05-04", "2026-05-05"]) {
      const blocks = result.scheduledBlocks.filter((b) => b.userDayDate === day);
      expect(blocks).toHaveLength(1);
      expect(blocks[0]!.startsAt.getHours()).toBe(22);
      expect(blocks[0]!.startsAt.getDate()).toBe(Number(day.slice(-2)));
    }
  });
  it.each(["00:00", "12:00"] as const)("preserves beforeWork Sleep at %s", (boundary) => {
    const { input } = fixture(boundary);
    input.blockTemplates[0]!.preferredWindow = "beforeWork";
    delete input.blockTemplates[0]!.customWindowStartTime;
    delete input.blockTemplates[0]!.customWindowEndTime;
    const result = generateSchedulePreview(input),
      b = result.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04")!;
    expect(b).toBeDefined();
    expect(b.endsAt.getTime() - b.startsAt.getTime()).toBe(480 * 60000);
    expect(
      result.generatedWorkBlocks.some(
        (w) =>
          b.startsAt.getTime() - 30 * 60000 < w.endsAt.getTime() &&
          b.endsAt.getTime() + 30 * 60000 > w.startsAt.getTime(),
      ),
    ).toBe(false);
  });
  for (const boundary of ["00:00", "12:00"] as const)
    for (const preferred of ["beforeWork", "afterWork"] as const) {
      it.each([
        ["09:00", "17:00", false],
        ["14:00", "22:00", false],
        ["21:45", "06:15", true],
      ] as const)(
        `${preferred} full footprint at ${boundary}, shift %s–%s`,
        (start, end, night) => {
          const { input } = fixture(boundary);
          Object.assign(input.shiftDefinitions[0]!, {
            startTime: start,
            endTime: end,
            crossesMidnight: night,
          });
          Object.assign(input.blockTemplates[0]!, {
            category: "fitness",
            durationMinutes: 60,
            preferredWindow: preferred,
          });
          delete input.blockTemplates[0]!.customWindowStartTime;
          delete input.blockTemplates[0]!.customWindowEndTime;
          const result = generateSchedulePreview(input),
            b = result.scheduledBlocks.find((b) => b.userDayDate === "2026-05-04")!;
          const work = result.generatedWorkBlocks
            .filter((w) => w.userDayDate === b.userDayDate)
            .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
          expect(work.length).toBeGreaterThan(0);
          const from = b.startsAt.getTime() - 30 * 60000,
            to = b.endsAt.getTime() + 30 * 60000;
          if (preferred === "beforeWork")
            expect(to).toBeLessThanOrEqual(work[0]!.startsAt.getTime());
          else expect(from).toBeGreaterThanOrEqual(work[work.length - 1]!.endsAt.getTime());
          expect(
            result.generatedWorkBlocks.some(
              (w) => from < w.endsAt.getTime() && to > w.startsAt.getTime(),
            ),
          ).toBe(false);
          input.realizedScheduleFacts = [
            {
              ...fact("bufferProtection"),
              startsAt: new Date(2026, 4, 1).toISOString(),
              endsAt: new Date(2026, 4, 31).toISOString(),
            },
          ];
          const blocked = generateSchedulePreview(input);
          expect(blocked.unplacedCandidates.some((c) => c.userDayDate === "2026-05-04")).toBe(true);
          expect(blocked.scheduledBlocks.some((c) => c.userDayDate === "2026-05-04")).toBe(false);
        },
      );
    }
});
