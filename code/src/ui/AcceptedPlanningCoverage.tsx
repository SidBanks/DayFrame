import type { AcceptedSummaryEvidence } from "./acceptedPlanningSummaryPresentation.js";
export function AcceptedPlanningCoverage({ evidence: e }: { evidence: AcceptedSummaryEvidence }) {
  const labels = {
    accepted: "Accepted planning",
    realization: "Scheduling",
    historical: "Published schedules",
    execution: "Outcomes",
  };
  return (
    <div className="df-accepted-coverage">
      {Object.entries(e.sourceCoverage)
        .filter(([, s]) => s !== "available")
        .map(([key, status]) => (
          <p role="status" key={key}>
            {labels[key as keyof typeof labels]}:{" "}
            {status === "protected"
              ? "information cannot currently be read safely"
              : "evidence is unavailable or incomplete"}
            .
          </p>
        ))}
      {e.completeness === "partial" && (
        <p role="status">
          This view has incomplete evidence. Readable records remain available; totals describe only
          those records.
        </p>
      )}
      {e.unresolvedHistorical.status === "available" && e.unresolvedHistorical.value.length > 0 && (
        <p>
          Some older published work lacks the retained planning links needed to place it under an
          accepted iteration. It has not been counted as no planning.
        </p>
      )}
    </div>
  );
}
