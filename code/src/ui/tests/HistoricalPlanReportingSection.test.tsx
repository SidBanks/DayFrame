/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DurableOccurrenceReference } from "../../core/occurrences/durableOccurrenceReference.js";
import type { HistoricalPlanDayPublicationV1 } from "../../core/historicalPlan/historicalPlan.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { HistoricalPlanReportingSection } from "../HistoricalPlanReportingSection.js";
import {
  deriveCurrentPreviewReportingCoverage,
  deriveOutcomeSummary,
} from "../../core/execution/executionSummary.js";
import type { DayFramePreview } from "../../state/types.js";

afterEach(cleanup);

const reference = {
  version: 1,
  sourceKind: "work",
  cycle: { id: "cycle", incarnationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" },
  entry: { id: "segment", incarnationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", kind: "segment" },
  shiftDefinition: { id: "shift", incarnationId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
  coordinate: { localStartDate: "2026-08-20", slot: 0 },
} as unknown as DurableOccurrenceReference;
const publishedDay: HistoricalPlanDayPublicationV1 = {
  version: 1,
  userDayDate: "2026-08-20",
  dayBoundaryStartTime: "03:00",
  weekStartsOn: "monday",
  utcOffsetMinutes: -300,
  occurrences: [
    {
      version: 1,
      reference,
      sourceFamily: "work",
      title: "Archived shift",
      category: "work",
      plan: {
        state: "scheduled",
        startsAt: "2026-08-20T13:00:00.000Z",
        endsAt: "2026-08-20T21:00:00.000Z",
      },
    },
  ],
};

describe("HistoricalPlanReportingSection", () => {
  it("distinguishes missing coverage from an explicitly published empty day", async () => {
    const base = createReadyDayFrameTestStore();
    const getHistoricalPlanDay = vi
      .fn()
      .mockResolvedValueOnce({ status: "unavailableNoPublication", userDayDate: "2026-08-20" })
      .mockResolvedValueOnce({
        status: "available",
        day: { ...publishedDay, userDayDate: "2026-08-21", occurrences: [] },
        batchId: "11111111-1111-4111-8111-111111111111",
        publishedAt: "2026-08-19T12:00:00.000Z",
        durability: "durable",
      });
    render(
      <HistoricalPlanReportingSection
        initialDate="2026-08-20"
        store={{ ...base, getHistoricalPlanDay }}
        now={() => new Date("2026-08-22T12:00:00.000Z")}
      />,
    );
    expect(
      await screen.findByText("No published plan history is available for this day."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Past planned date"), {
      target: { value: "2026-08-21" },
    });
    expect(
      await screen.findByText("No occurrences were published for this day."),
    ).toBeInTheDocument();
  });

  it("submits a frozen historical target through the existing report control", async () => {
    const base = createReadyDayFrameTestStore(undefined, {
      allocateExecutionRecordId: () => "00000000-0000-4000-8000-000000000001" as never,
      allocateExecutionSubjectId: () => "00000000-0000-4000-8000-000000000002" as never,
      executionHistoryClock: () => "2026-08-22T12:00:00.000Z",
    });
    const getHistoricalPlanDay = vi.fn().mockResolvedValue({
      status: "available",
      day: publishedDay,
      batchId: "11111111-1111-4111-8111-111111111111",
      publishedAt: "2026-08-19T12:00:00.000Z",
      durability: "durable",
    });
    const beforeDay = structuredClone(publishedDay);
    render(
      <HistoricalPlanReportingSection
        initialDate="2026-08-20"
        store={{ ...base, getHistoricalPlanDay }}
        now={() => new Date("2026-08-22T12:00:00.000Z")}
      />,
    );
    expect(await screen.findByText("Archived shift")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Report outcome" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Submit report" }, { timeout: 3_000 }),
    );
    await waitFor(() => expect(base.getExecutionHistory()).toHaveLength(1));
    expect(base.getExecutionHistory()[0]).toMatchObject({
      subject: { kind: "planned", reference },
      snapshot: { title: "Archived shift" },
      outcome: "completed",
    });
    expect(publishedDay).toEqual(beforeDay);
    expect(getHistoricalPlanDay).toHaveBeenCalledTimes(1);
    expect(deriveOutcomeSummary({ records: base.getExecutionHistory() })).toMatchObject({
      status: "available",
      summary: { completed: 1, totalSubjects: 1 },
    });
    const emptyCurrentPreview = {
      result: {
        generatedWorkBlocks: [],
        blockCandidates: [],
        scheduledBlocks: [],
        unplacedCandidates: [],
        frictionPoints: [],
        planDecisionResults: [],
      },
      rangeStartDate: "2026-08-22",
      rangeEndDate: "2026-08-22",
      planningWindowStart: new Date("2026-08-22T03:00:00.000Z"),
      planningWindowEnd: new Date("2026-08-23T03:00:00.000Z"),
      generatedAt: "2026-08-22T12:00:00.000Z",
      isStale: false,
    } as DayFramePreview;
    expect(
      deriveCurrentPreviewReportingCoverage({
        authoredSetup: base.getState(),
        preview: emptyCurrentPreview,
        records: base.getExecutionHistory(),
      }),
    ).toEqual({
      status: "available",
      coverage: {
        eligibleOccurrences: 0,
        reportedOccurrences: 0,
        unreportedOccurrences: 0,
      },
    });
  });

  it("refreshes a loaded historical day after full clear instead of retaining stale rows", async () => {
    const base = createReadyDayFrameTestStore();
    const getHistoricalPlanDay = vi
      .fn()
      .mockResolvedValueOnce({
        status: "available",
        day: publishedDay,
        batchId: "11111111-1111-4111-8111-111111111111",
        publishedAt: "2026-08-19T12:00:00.000Z",
        durability: "durable",
      })
      .mockResolvedValue({ status: "unavailableNoPublication", userDayDate: "2026-08-20" });
    render(
      <HistoricalPlanReportingSection
        initialDate="2026-08-20"
        store={{ ...base, getHistoricalPlanDay }}
        now={() => new Date("2026-08-22T12:00:00.000Z")}
      />,
    );
    expect(await screen.findByText("Archived shift")).toBeInTheDocument();
    await act(async () => {
      await base.clearLocalData();
    });
    expect(
      await screen.findByText("No published plan history is available for this day."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Archived shift")).not.toBeInTheDocument();
  });
});
