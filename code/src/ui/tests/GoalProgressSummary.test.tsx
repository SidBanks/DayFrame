/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { projectManualQuantityProgressV1 } from "../../core/progress/manualQuantityProgress.js";
import type { GoalV1 } from "../../core/goals/goal.js";
import type { GoalMeasurementDefinitionV1 } from "../../core/measurement/measurementDefinition.js";
import type { GoalProgressObservationV1 } from "../../core/progressObservation/progressObservation.js";
import type { HistoricalIntelligenceSummaryStore } from "../HistoricalIntelligenceSummary.js";
import { displayPercentage, GoalProgressSummary, quantity } from "../GoalProgressSummary.js";

afterEach(cleanup);
const cutoff = "2026-08-24T18:00:00.000Z";
const goal = {
  version: 1,
  id: "00000000-0000-4000-8000-000000000001",
  revision: 1,
  title: "Write book",
  status: "active",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
  links: [],
} as unknown as GoalV1;
const definition = {
  version: 1,
  id: "00000000-0000-4000-8000-000000000002",
  goalId: goal.id,
  revision: 1,
  status: "active",
  policyRef: { id: "manualQuantityTarget", version: 1 },
  config: { targetValue: "50000", unitId: "words" },
  effectiveFrom: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-08-01T00:00:00.000Z",
  fingerprint: "fixture",
} as unknown as GoalMeasurementDefinitionV1;
function progress(value?: string) {
  const observation =
    value === undefined
      ? undefined
      : ({
          version: 1,
          id: "00000000-0000-4000-8000-000000000003",
          revision: 1,
          goalId: goal.id,
          definitionId: definition.id,
          definitionRevision: 1,
          unitId: "words",
          value,
          observedAt: "2026-08-24T16:10:00.000Z",
          recordedAt: "2026-08-24T16:12:00.000Z",
          status: "active",
          fingerprint: "fixture",
        } as GoalProgressObservationV1);
  return projectManualQuantityProgressV1({
    query: { goalId: goal.id, evaluationAsOf: cutoff },
    goal,
    definitionResolution: { status: "available", definition },
    ...(observation ? { observation } : {}),
  });
}
function store(
  result:
    | ReturnType<typeof progress>
    | {
        status: "notDefined";
        identity: { id: "manualQuantityProgress"; version: 1 };
        query: { goalId: typeof goal.id; evaluationAsOf: string };
        currentGoal: { id: typeof goal.id; title: string; status: "active" };
      } = progress("12400"),
  definitions: GoalMeasurementDefinitionV1[] = [definition],
) {
  return {
    queryGoalProgress: () => structuredClone(result),
    listMeasurementDefinitionHistory: () => structuredClone(definitions),
    subscribeMeasurementDefinitions: () => () => undefined,
    subscribeProgressObservations: () => () => undefined,
  } as unknown as HistoricalIntelligenceSummaryStore;
}
describe("GoalProgressSummary", () => {
  it("presents quantity first, deterministic percentage, arithmetic comparison, and product provenance", () => {
    render(<GoalProgressSummary evaluationAsOf={cutoff} goal={goal} store={store()} />);
    expect(screen.getByLabelText(/12,400 of 50,000 words; 24.8 percent/)).toBeInTheDocument();
    expect(screen.getByText("24.8%")).toBeInTheDocument();
    expect(screen.getByText("Below target")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "How this Progress was calculated" });
    fireEvent.click(button, { detail: 0 });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Measurement details").parentElement).toHaveFocus();
    expect(screen.getByText("Quantity toward a target")).toBeInTheDocument();
    expect(screen.queryByText(definition.id)).not.toBeInTheDocument();
  });
  it.each([
    ["0", "0%", "Below target"],
    ["50000", "100%", "At target"],
    ["60000", "120%", "Above target"],
  ])(
    "renders %s as measured evidence without lifecycle claims",
    (value, percentage, comparison) => {
      render(
        <GoalProgressSummary evaluationAsOf={cutoff} goal={goal} store={store(progress(value))} />,
      );
      expect(screen.getByText(percentage)).toBeInTheDocument();
      expect(screen.getByText(comparison)).toBeInTheDocument();
      expect(screen.queryByText(/Goal complete/i)).not.toBeInTheDocument();
      cleanup();
    },
  );
  it("distinguishes insufficient evidence, never measured, and stopped with navigation-only handoffs", () => {
    const open = vi.fn();
    const { rerender } = render(
      <GoalProgressSummary
        evaluationAsOf={cutoff}
        goal={goal}
        onOpenPlanner={open}
        store={store(progress())}
      />,
    );
    expect(screen.getByText("No current value recorded.")).toBeInTheDocument();
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Record Current Value in Planner" }));
    expect(open).toHaveBeenCalledOnce();
    const none = {
      identity: { id: "manualQuantityProgress" as const, version: 1 as const },
      query: { goalId: goal.id, evaluationAsOf: cutoff },
      status: "notDefined" as const,
      currentGoal: { id: goal.id, title: goal.title, status: "active" as const },
    };
    rerender(
      <GoalProgressSummary
        evaluationAsOf={cutoff}
        goal={goal}
        onOpenPlanner={open}
        store={store(none, [])}
      />,
    );
    expect(screen.getByText("No quantity measurement configured.")).toBeInTheDocument();
    rerender(
      <GoalProgressSummary
        evaluationAsOf={cutoff}
        goal={goal}
        onOpenPlanner={open}
        store={store(none, [{ ...definition, status: "inactive" }])}
      />,
    );
    expect(screen.getByText("Measurement is currently stopped.")).toBeInTheDocument();
  });
  it("uses string-safe display formatting", () => {
    expect(quantity("123456789.25")).toBe("123,456,789.25");
    expect(displayPercentage("33.3333")).toBe("33.33");
  });
});
