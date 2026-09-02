/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CommitmentSection, type CommitmentEditorTarget } from "../CommitmentSection.js";
import type { SetupDraft } from "../setupDraft.js";

afterEach(cleanup);

const templateIncarnationA = "00000000-0000-4000-8000-000000000001";
const templateIncarnationB = "00000000-0000-4000-8000-000000000002";
const recurrenceIncarnationA = "00000000-0000-4000-8000-000000000003";
const recurrenceIncarnationB = "00000000-0000-4000-8000-000000000004";

function createDraft(input?: {
  templateIncarnationId?: string;
  recurrenceIncarnationId?: string;
  frequency?: "daily" | "custom";
}): SetupDraft {
  return {
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
    previewRange: { preset: "threeDays", startDate: "2026-05-04", endDate: "2026-05-06" },
    shiftDefinitions: [],
    shiftCycles: [],
    templateEntries: [
      {
        template: {
          id: "template_errands",
          incarnationId: input?.templateIncarnationId ?? templateIncarnationA,
          userId: "user_001",
          title: "Errands",
          category: "admin",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 3,
          preferredWindow: "anyAvailable",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-01T00:00:00.000Z",
          updatedAt: "2026-05-01T00:00:00.000Z",
        },
        recurrence: {
          id: "rec_errands",
          incarnationId: input?.recurrenceIncarnationId ?? recurrenceIncarnationA,
          blockTemplateId: "template_errands",
          frequency: input?.frequency ?? "daily",
        },
      },
    ],
    lifecycle: { created: [], deleted: [] },
  } as unknown as SetupDraft;
}

const exactTarget: CommitmentEditorTarget = {
  logicalId: "template_errands",
  incarnationId: templateIncarnationA,
  recurrenceLogicalId: "rec_errands",
  recurrenceIncarnationId: recurrenceIncarnationA,
};

function Harness({
  initialDraft = createDraft(),
  target = null,
  handled,
  requestAdd = false,
  addHandled,
}: {
  initialDraft?: SetupDraft;
  target?: CommitmentEditorTarget | null;
  handled?: (status: "opened" | "unavailable") => void;
  requestAdd?: boolean;
  addHandled?: () => void;
}) {
  const [draft, setDraft] = useState(initialDraft);
  return (
    <CommitmentSection
      draft={draft}
      {...(addHandled ? { onRequestedAddEditorHandled: addHandled } : {})}
      {...(handled ? { onRequestedEditorTargetHandled: handled } : {})}
      requestedAddEditor={requestAdd}
      requestedEditorTarget={target}
      setDraft={setDraft}
    />
  );
}

describe("CommitmentSection exact identity and recurrence authoring", () => {
  it("opens the canonical add editor on a contextual request without date inference", () => {
    const addHandled = vi.fn();
    render(<Harness addHandled={addHandled} requestAdd />);

    expect(screen.getByRole("heading", { name: "Add Commitment" })).toBeInTheDocument();
    expect(screen.getByLabelText("Repeats")).toHaveValue("daily");
    expect(screen.queryByLabelText(/date/i)).not.toBeInTheDocument();
    expect(addHandled).toHaveBeenCalledTimes(1);
    expect(document.getElementById("commitment-title")).toHaveFocus();
  });

  it("opens only an exact template and recurrence incarnation", () => {
    const handled = vi.fn();
    render(<Harness handled={handled} target={exactTarget} />);

    expect(document.getElementById("commitment-title")).toHaveValue("Errands");
    expect(handled).toHaveBeenCalledWith("opened");
  });

  it("rejects a recreated source with identical logical IDs and content", () => {
    const handled = vi.fn();
    render(
      <Harness
        handled={handled}
        initialDraft={createDraft({
          templateIncarnationId: templateIncarnationB,
          recurrenceIncarnationId: recurrenceIncarnationB,
        })}
        target={exactTarget}
      />,
    );

    expect(document.getElementById("commitment-title")).not.toBeInTheDocument();
    expect(handled).toHaveBeenCalledWith("unavailable");
    expect(screen.getByRole("heading", { name: "Commitments" })).toHaveFocus();
  });

  it("requires and round-trips deterministically ordered specific weekdays", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Edit commitment Errands" }));
    fireEvent.change(screen.getByLabelText("Repeats"), {
      target: { value: "specificWeekdays" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose at least one weekday.");
    expect(document.getElementById("commitment-weekdays")).toHaveFocus();

    fireEvent.click(screen.getByRole("checkbox", { name: "Wednesday" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Monday" }));
    fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
    expect(screen.getByText(/Monday, Wednesday/)).toBeInTheDocument();
  });

  it("requires a positive integer times-per-user-week count", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Edit commitment Errands" }));
    fireEvent.change(screen.getByLabelText("Repeats"), {
      target: { value: "timesPerUserWeek" },
    });
    fireEvent.change(screen.getByLabelText("Times per user-week"), { target: { value: "1.5" } });
    fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
    expect(screen.getByRole("alert")).toHaveTextContent("positive whole number");

    fireEvent.change(screen.getByLabelText("Times per user-week"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
    expect(screen.getByText(/3 times per user-week/)).toBeInTheDocument();
  });

  it("does not offer unsupported recurrence as a normal choice and preserves existing custom data", () => {
    render(<Harness initialDraft={createDraft({ frequency: "custom" })} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit commitment Errands" }));

    expect(screen.getByRole("option", { name: "custom (advanced; preserved)" })).toBeDisabled();
    expect(screen.queryByRole("option", { name: "perShiftSegment" })).not.toBeInTheDocument();
    fireEvent.change(document.getElementById("commitment-title")!, {
      target: { value: "Renamed errands" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
    expect(screen.getByText(/Custom recurrence \(advanced setup\)/)).toBeInTheDocument();
  });
});
