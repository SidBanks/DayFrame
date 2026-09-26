/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { DayFramePreview } from "../../state/types.js";
import { ReviewConflicts, groupReviewConflicts } from "../ReviewConflicts.js";
import { createGoalEditingContext } from "../goalEditingContext.js";

afterEach(cleanup);
// Synthetic presentation density only. This fixture does not certify scheduling,
// durable correction validity, or storage performance.
function density(identified: boolean): DayFramePreview {
  return {
    isStale: false,
    result: {
      scheduledBlocks: [],
      unplacedCandidates: Array.from({ length: 100 }, (_, i) => ({
        id: `block-${i}`,
        ...(identified
          ? {
              commitmentNavigationIdentity: {
                templateId: "routine",
                templateIncarnationId: "lifetime-1",
                recurrenceId: "daily",
                recurrenceIncarnationId: "recurrence-1",
              },
            }
          : {}),
      })),
      frictionPoints: Array.from({ length: 100 }, (_, i) => ({
        id: `friction-${i}`,
        kind: "unplaced",
        title: "Routine",
        message: "A placement needs review.",
        affectedBlockIds: [`block-${i}`],
        affectedUserDayDate: `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
        ignored: false,
        suggestedFixes: [{ id: `fix-${i}`, action: "moveBlock", label: "Move block" }],
      })),
    },
  } as unknown as DayFramePreview;
}

it("groups 100 exact-lifetime occurrences and dispatches only the explicitly selected Try", () => {
  const preview = density(true),
    onTry = vi.fn();
  expect(groupReviewConflicts(preview)).toHaveLength(1);
  render(
    <ReviewConflicts
      preview={preview}
      context={createGoalEditingContext()}
      onTry={onTry}
      onInspect={vi.fn()}
    />,
  );
  expect(screen.getAllByRole("button", { name: "Try: Move block" })).toHaveLength(1);
  fireEvent.change(screen.getByLabelText("Occurrence to inspect"), {
    target: { value: "friction-73" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Try: Move block" }));
  expect(onTry).toHaveBeenCalledExactlyOnceWith({
    selectedFrictionPointId: "friction-73",
    selectedSuggestedFixId: "fix-73",
  });
});

it("keeps ambiguous sources individual and reveals ten rows at a time", () => {
  const preview = density(false),
    onTry = vi.fn();
  expect(groupReviewConflicts(preview)).toHaveLength(100);
  render(
    <ReviewConflicts
      preview={preview}
      context={createGoalEditingContext()}
      onTry={onTry}
      onInspect={vi.fn()}
    />,
  );
  expect(screen.getAllByRole("button", { name: "Try: Move block" })).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "Show more conflicts" }));
  expect(screen.getAllByRole("button", { name: "Try: Move block" })).toHaveLength(20);
  expect(onTry).not.toHaveBeenCalled();
});

it("does not group a recreated source into the old lifetime and disables stale Try", () => {
  const preview = density(true);
  preview.result.unplacedCandidates[1]!.commitmentNavigationIdentity!.templateIncarnationId =
    "lifetime-2";
  expect(groupReviewConflicts(preview)).toHaveLength(2);
  preview.isStale = true;
  const onTry = vi.fn();
  render(
    <ReviewConflicts
      preview={preview}
      context={createGoalEditingContext()}
      onTry={onTry}
      onInspect={vi.fn()}
    />,
  );
  for (const button of screen.getAllByRole("button", { name: "Try: Move block" })) {
    expect(button).toBeDisabled();
    fireEvent.click(button);
  }
  expect(onTry).not.toHaveBeenCalled();
});
