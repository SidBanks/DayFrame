import {
  buildSelectedDayEvidence,
  type SelectedDayEvidenceQuery,
} from "../core/productEvidence/selectedDayEvidence.js";
import { available, validOwnerDay } from "../core/productEvidence/evidence.js";
import { isCanonicalTodayEvaluationInstant } from "../core/today/buildTodayReadModel.js";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import { resolveRequiredSleep } from "../core/sleep/resolveRequiredSleep.js";
import type { SleepFoundationAuthority } from "../core/sleep/sleepFoundationalOccupancy.js";
import type { DayFrameState } from "./types.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { ExecutionHistorySurface } from "./executionHistorySurface.js";
import type { DayFrameReadiness } from "./dayFrameReadiness.js";
import { readDayActuals, readDayPublications } from "./productEvidenceSources.js";

export async function querySelectedDayEvidence(
  query: SelectedDayEvidenceQuery,
  sources: {
    state: DayFrameState;
    readiness: DayFrameReadiness;
    authority: SleepFoundationAuthority;
    historicalPlan: Pick<
      HistoricalPlanSurface,
      "getHistoricalPlanDayEvidence" | "getHistoricalPlanBatchEvidence"
    >;
    execution: Pick<
      ExecutionHistorySurface,
      | "getExecutionHistory"
      | "getExecutionHistoryIngressStatus"
      | "getExecutionHistoryMigrationStatus"
    >;
  },
) {
  if (!validOwnerDay(query.ownerDay) || !isCanonicalTodayEvaluationInstant(query.asOf))
    return { status: "invalidQuery", reason: "invalidOwnerDayOrAsOf" } as const;
  try {
    const authoredStatus =
      sources.readiness.status === "ready"
        ? "available"
        : sources.readiness.status === "protected"
          ? "protected"
          : "unavailable";
    const realized =
      sources.authority.status === "complete"
        ? available([...sources.authority.realizedFacts])
        : ({ status: sources.authority.status, reason: "planningAuthorityUnavailable" } as const);
    const sleep =
      authoredStatus !== "available"
        ? ({ status: authoredStatus, reason: "authoredAuthorityUnavailable" } as const)
        : available(
            resolveRequiredSleep({
              authoredState: sources.state,
              authority: sources.authority,
              ownerRange: {
                startUserDayDate: query.ownerDay,
                endUserDayDateExclusive: addUserDayLabels(query.ownerDay, 1),
              },
            }),
          );
    const history = await readDayPublications(sources.historicalPlan, query.ownerDay, query.asOf);
    const actual = await readDayActuals(
      sources.execution,
      new Set([query.ownerDay]),
      query.asOf,
      history,
      sources.historicalPlan,
    );
    return buildSelectedDayEvidence({
      query,
      state: sources.state,
      authoredStatus,
      realized,
      sleep,
      history,
      actual,
    });
  } catch {
    return { status: "error", reason: "evidenceQueryFailed" } as const;
  }
}
