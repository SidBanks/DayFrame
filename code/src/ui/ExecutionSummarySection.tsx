import { useEffect, useState, type ReactElement } from "react";
import {
  deriveCurrentPreviewReportingCoverage,
  deriveOutcomeSummary,
} from "../core/execution/executionSummary.js";
import type { ExecutionRecordV1 } from "../core/execution/executionRecord.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../state/types.js";
import type { ExecutionReportingStore } from "./ExecutionReportControl.js";

export function ExecutionSummarySection({
  authoredSetup,
  preview,
  store,
}: {
  authoredSetup: DayFrameAuthoredSetup;
  preview: DayFramePreview | null;
  store: ExecutionReportingStore;
}): ReactElement {
  const [records, setRecords] = useState<ExecutionRecordV1[]>(store.getExecutionHistory());
  const [ingress, setIngress] = useState(store.getExecutionHistoryIngressStatus());
  const [quarantinedCount, setQuarantinedCount] = useState(
    store.getQuarantinedExecutionHistory().length,
  );
  useEffect(() => {
    const history = store.subscribeExecutionHistory((value) => {
      setRecords(value);
      setQuarantinedCount(store.getQuarantinedExecutionHistory().length);
    });
    const ingressSubscription = store.subscribeExecutionHistoryIngress((value) => {
      setIngress(value);
      setQuarantinedCount(store.getQuarantinedExecutionHistory().length);
    });
    return () => {
      history();
      ingressSubscription();
    };
  }, [store]);
  if (ingress.status === "recoveryRequired")
    return (
      <section aria-labelledby="reported-outcomes-heading" className="df-execution-summary">
        <h2 className="df-panel-title" id="reported-outcomes-heading">
          Reported outcomes
        </h2>
        <p className="df-danger-message" role="status">
          Execution history needs recovery before outcomes can be summarized.
        </p>
      </section>
    );
  const outcome = deriveOutcomeSummary({
    records,
    ...(preview
      ? { startUserDayDate: preview.rangeStartDate, endUserDayDate: preview.rangeEndDate }
      : {}),
  });
  const coverage = deriveCurrentPreviewReportingCoverage({ authoredSetup, preview, records });
  const summary = outcome.status === "available" ? outcome.summary : null;
  return (
    <section aria-labelledby="reported-outcomes-heading" className="df-execution-summary">
      <h2 className="df-panel-title" id="reported-outcomes-heading">
        Reported outcomes
      </h2>
      <p className="df-muted">
        {preview ? "In this Preview range" : "Across all execution history"}
      </p>
      {summary?.totalSubjects ? (
        <dl className="df-outcome-counts">
          <div>
            <dt>Completed</dt>
            <dd>{summary.completed}</dd>
          </div>
          <div>
            <dt>Partial</dt>
            <dd>{summary.partial}</dd>
          </div>
          <div>
            <dt>Skipped</dt>
            <dd>{summary.skipped}</dd>
          </div>
          <div>
            <dt>Not reported</dt>
            <dd>{summary.knownNotReportedSubjects}</dd>
          </div>
        </dl>
      ) : (
        <p className="df-empty">No outcomes reported in this period.</p>
      )}
      {summary?.knownNotReportedSubjects ? (
        <p className="df-muted">
          Not reported includes known history subjects whose report was withdrawn.
        </p>
      ) : null}
      {quarantinedCount > 0 ? (
        <p className="df-warning-message" role="status">
          Some preserved history could not be included.
        </p>
      ) : null}
      <h3 className="df-group-title">Current Preview reporting coverage</h3>
      <p>{coverageCopy(coverage)}</p>
    </section>
  );
}

function coverageCopy(result: ReturnType<typeof deriveCurrentPreviewReportingCoverage>): string {
  if (result.status === "available")
    return result.coverage.eligibleOccurrences === 0
      ? "No reportable occurrences in this Preview."
      : `Reports recorded for ${result.coverage.reportedOccurrences} of ${result.coverage.eligibleOccurrences} reportable occurrences in this Preview.`;
  if (result.reason === "noPreview") return "Generate a preview to see current reporting coverage.";
  if (result.reason === "stalePreview")
    return "Regenerate the preview to refresh reporting coverage.";
  if (result.reason === "tryPreview")
    return "Accept or discard the Try result to refresh reporting coverage.";
  return "Current reporting coverage is unavailable because the Preview context is inconsistent.";
}
