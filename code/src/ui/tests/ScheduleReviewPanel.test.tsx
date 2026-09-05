/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScheduleReviewPanel } from "../ScheduleReviewPanel.js";

afterEach(cleanup);

function queryResult() {
  return {
    version: 1,
    sourceFingerprint: "source-1",
    planningDataCoverage: "complete",
    preview: { availability: "available", coverage: "covers", freshness: "current" },
    scheduledReality: [],
    derivedSchedule: [],
    acceptedLiabilities: [],
    proposals: [
      {
        epistemicClass: "proposed",
        membership: "contained",
        proposal: {
          id: "proposal",
          revision: 1,
          horizon: { startUserDayDate: "2026-09-05", endUserDayDateExclusive: "2026-09-06" },
          options: [{ id: "option", preferred: true }],
        },
      },
    ],
    unresolvedFrictionCount: 0,
    publication: {
      epistemicClass: "historical",
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
  };
}

describe("ScheduleReviewPanel", () => {
  it("publishes the exact reviewed range explicitly and announces durable success", async () => {
    let finish!: (value: { status: "published"; batchId: string; publishedAt: string }) => void;
    const publish = vi.fn(
      () =>
        new Promise<{ status: "published"; batchId: string; publishedAt: string }>((resolve) => {
          finish = resolve;
        }),
    );
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={async () => queryResult() as never}
        unresolvedFrictionCount={0}
        onGeneratePreview={vi.fn()}
        onOpenFriction={vi.fn()}
        onAcceptProposal={vi.fn()}
        onRejectProposal={vi.fn()}
        onPublish={publish}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    const button = await screen.findByRole("button", {
      name: /Publish schedule: 2026-09-05–2026-09-06 \(exclusive\)/,
    });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(publish).toHaveBeenCalledWith({
      publicationRange: {
        version: 1,
        scopeType: "publicationRange",
        startUserDayDate: "2026-09-05",
        endUserDayDateExclusive: "2026-09-06",
        provenance: { source: "explicitPublication" },
      },
      expectedSourceFingerprint: "source-1",
      publishedAt: "2026-09-05T13:00:00Z",
    });
    finish({ status: "published", batchId: "batch", publishedAt: "2026-09-05T13:00:00Z" });
    expect(await screen.findByRole("status")).toHaveTextContent(/immutable historical record/);
  });

  it("shows readiness, keeps Proposal non-authoritative, and routes decisions through existing commands", async () => {
    const accept = vi.fn(async () => ({ status: "accepted" }));
    const query = vi.fn(async () => queryResult() as never);
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={query}
        unresolvedFrictionCount={0}
        onGeneratePreview={vi.fn()}
        onOpenFriction={vi.fn()}
        onAcceptProposal={accept}
        onRejectProposal={vi.fn(async () => ({ status: "accepted" }))}
        onPublish={vi.fn(async () => ({
          status: "published" as const,
          batchId: "batch",
          publishedAt: "2026-09-05T13:00:00Z",
        }))}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    expect(await screen.findByRole("heading", { name: "Ready to publish" })).toBeVisible();
    expect(screen.getByText(/does not own schedule time/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Accept preferred option" }));
    await waitFor(() =>
      expect(accept).toHaveBeenCalledWith({
        proposalId: "proposal",
        proposalRevision: 1,
        optionId: "option",
      }),
    );
    expect(await screen.findByText(/Decision recorded/)).toBeVisible();
    expect(query).toHaveBeenCalledTimes(2);
  });

  it("explains blockers and exposes governed existing actions", async () => {
    const generate = vi.fn(),
      friction = vi.fn();
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={async () =>
          ({
            ...queryResult(),
            planningDataCoverage: "unknown",
            preview: {
              availability: "unavailable",
              coverage: "doesNotCover",
              freshness: "unavailable",
            },
            proposals: [],
          }) as never
        }
        unresolvedFrictionCount={1}
        onGeneratePreview={generate}
        onOpenFriction={friction}
        onAcceptProposal={vi.fn()}
        onRejectProposal={vi.fn()}
        onPublish={vi.fn()}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    expect(await screen.findByRole("heading", { name: "Not ready to publish" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Generate Preview" }));
    fireEvent.click(screen.getByRole("button", { name: "Resolve schedule conflicts" }));
    expect(generate).toHaveBeenCalledOnce();
    expect(friction).toHaveBeenCalledOnce();
  });
});
