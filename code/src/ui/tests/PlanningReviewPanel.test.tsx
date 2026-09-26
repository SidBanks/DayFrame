import { reviewModelFixture } from "../../state/reviewSourceTestFixtures.js";
/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createReviewScope } from "../../core/planning/reviewScope.js";
import { PlanningReviewPanel } from "../PlanningReviewPanel.js";

describe("PlanningReviewPanel", () => {
  it("exposes bounded loading and unknown-coverage states accessibly", async () => {
    const query = vi.fn(async () =>
      reviewModelFixture({
        reviewScope: createReviewScope({
          kind: "day",
          anchorUserDayDate: "2026-09-05",
          weekStartsOn: "monday",
        }),
        planningDataCoverage: "unknown",
        preview: {
          availability: "unavailable",
          coverage: "doesNotCover",
          freshness: "unavailable",
        },
        scheduledReality: [],
        derivedSchedule: [],
        acceptedLiabilities: [],
        proposals: [],
        publication: {
          epistemicClass: "historical",
          coverage: "unknown",
          publishedUserDays: [],
          missingUserDays: [],
        },
      }),
    );
    const reviewScope = createReviewScope({
      kind: "day",
      anchorUserDayDate: "2026-09-05",
      weekStartsOn: "monday",
    });
    render(
      <PlanningReviewPanel
        historyAsOf="2026-09-05T12:00:00Z"
        query={query}
        refreshKey="a"
        reviewScope={reviewScope}
      />,
    );
    expect(screen.getByLabelText("Planning review")).toHaveAttribute("aria-busy", "true");
    expect(
      await screen.findByText(/Missing facts are not treated as an empty schedule/),
    ).toBeVisible();
    expect(screen.queryByText(/Nothing is scheduled/)).not.toBeInTheDocument();
    expect(query).toHaveBeenCalledTimes(1);
  });
});
