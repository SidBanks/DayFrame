// QA-only production bundle. All query responses on this page are simulated presentation evidence.
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { GoalAcceptedPlanningSection } from "../../../../../code/src/ui/GoalAcceptedPlanningSection.js";
import { createGoalEditingContext } from "../../../../../code/src/ui/goalEditingContext.js";
import {
  networkSummaryFixture,
  largeSummaryFixture,
} from "../../../../../code/src/ui/tests/acceptedSummaryFixtures.js";
import { buildAcceptedPlanningEvidence } from "../../../../../code/src/core/productEvidence/acceptedPlanningEvidence.js";
import { available } from "../../../../../code/src/core/productEvidence/evidence.js";
import "../../../../../code/src/ui/dayFrameUi.css";
function Harness() {
  const [mode, setMode] = useState("partial"),
    [context] = useState(createGoalEditingContext);
  const query = useMemo(
    () => async (input) => {
      if (mode === "failure") throw Error("Simulated query failure");
      const fixture = networkSummaryFixture("withdrawn");
      if (mode === "density") {
        const value = JSON.parse(
          JSON.stringify(largeSummaryFixture(20)).replace(
            /goal-\d+/g,
            "goal-network",
          ),
        );
        value.query = input;
        return value;
      }
      const source = { ...fixture.input, query: input };
      if (mode === "empty")
        source.proposals = available({
          version: 1,
          proposals: [],
          candidates: [],
          decisions: [],
          acceptedAllocations: [],
        });
      if (mode === "empty") {
        source.realizations = available({
          version: 1,
          realizations: [],
          facts: [],
        });
        source.history = available([]);
        source.actual = available([]);
      }
      if (mode === "partial") {
        source.proposals = { status: "protected", reason: "simulated" };
        source.realizations = { status: "protected", reason: "simulated" };
        source.actual = { status: "protected", reason: "simulated" };
      }
      if (mode === "unknown")
        source.realizations = { status: "unavailable", reason: "simulated" };
      const projected = buildAcceptedPlanningEvidence(source);
      return {
        ...projected,
        currentSourceContext: fixture.evidence.currentSourceContext,
      };
    },
    [mode],
  );
  const subscribe = () => () => true;
  const store = useMemo(
    () => ({
      subscribeGoals: subscribe,
      subscribeGoalPlanning: subscribe,
      subscribeProposals: subscribe,
      subscribeExecutionHistory: subscribe,
      subscribeExecutionHistoryIngress: subscribe,
      subscribeHistory: subscribe,
    }),
    [],
  );
  return (
    <main className="df-shell">
      <h1>Task 9.25 defensive presentation QA</h1>
      <p>
        SIMULATED QUERY RESPONSES. Density is synthetic: 60 iterations and 360
        facts, not persisted authority or a storage benchmark.
      </p>
      <label>
        QA scenario
        <select
          aria-label="QA scenario"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="partial">Protected partial</option>
          <option value="unknown">Unknown realization</option>
          <option value="empty">Complete empty</option>
          <option value="failure">Query failure</option>
          <option value="density">Synthetic density</option>
        </select>
      </label>
      <GoalAcceptedPlanningSection
        goalId="goal-network"
        currentDay="2026-09-23"
        context={context}
        query={query}
        now={() => new Date()}
        store={store}
        onDay={() => {}}
        onReview={() => {}}
      />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Harness />);
