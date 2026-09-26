import type { RealizedScheduleFactV1 } from "../core/planning/realizedScheduleIdentity.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export function ScheduledGoalFacts({
  facts,
  goalNames = {},
  qualified = true,
}: {
  facts: readonly RealizedScheduleFactV1[];
  goalNames?: Readonly<Record<string, string>>;
  qualified?: boolean;
}) {
  if (!facts.length) return null;
  return (
    <section aria-label="Scheduled Goal work and resources">
      <h4>Scheduled Goal work and resources</h4>
      <ul className="df-plain-list">
        {facts.map((fact) => (
          <li key={fact.id}>
            <strong>
              {fact.scheduleRole === "productiveGoalWork"
                ? "Goal work"
                : fact.scheduleRole === "supportActivity"
                  ? "Support activity"
                  : "Protected Buffer — not an activity"}
            </strong>
            {" · "}
            {goalNames[fact.lineage.goalId] ?? "Goal unavailable"}
            {" · "}
            {fact.userDayDate}
            {" · "}
            {formatHumanTimeRange(new Date(fact.startsAt), new Date(fact.endsAt))}
          </li>
        ))}
      </ul>
      <p>
        {qualified
          ? "Accepted work has been scheduled. Publication remains a separate action."
          : "These readable records do not establish complete current scheduling coverage."}
      </p>
    </section>
  );
}
