import {
  addUserDayLabels,
  resolveUserDayContainingInstant,
  resolveUserDayWindowForLabel,
} from "../time/canonicalUserDay.js";
import { isCanonicalTodayEvaluationInstant } from "../today/buildTodayReadModel.js";
import { queryMonthlyPlanner } from "../monthlyPlanner/queryMonthlyPlanner.js";
import { visibleInterval } from "../planning/planningScope.js";
import {
  createDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
} from "../occurrences/durableOccurrenceReference.js";
import { materializeHistoricalPlanExecutionTarget } from "../execution/historicalPlanExecutionTarget.js";
import { publishedSleepExecutionTarget } from "../sleep/sleepExecution.js";
import { historicalOccurrenceTimingSemantics } from "../historicalPlan/historicalPlan.js";
import type { DayFrameState } from "../../state/types.js";
import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";
import type { SleepResolutionV1 } from "../sleep/sleepResolution.js";
import {
  available,
  stableKey,
  validOwnerDay,
  type Evidence,
  type HistoricalEvidence,
  type ActualEvidence,
} from "./evidence.js";

export type SelectedDayEvidenceQuery = { ownerDay: string; asOf: string };
export type SelectedDayEvidenceInput = {
  query: SelectedDayEvidenceQuery;
  state: DayFrameState;
  authoredStatus: "available" | "protected" | "unavailable";
  realized: Evidence<RealizedScheduleFactV1[]>;
  sleep: Evidence<SleepResolutionV1>;
  history: HistoricalEvidence;
  actual: ActualEvidence;
};

/** Selected owner and real evaluation time are independent; no Today query or schedule engine. */
export function buildSelectedDayEvidence(input: SelectedDayEvidenceInput) {
  const { query, state } = input;
  if (!validOwnerDay(query.ownerDay) || !isCanonicalTodayEvaluationInstant(query.asOf))
    return { status: "invalidQuery", reason: "invalidOwnerDayOrAsOf" } as const;
  const temporal = {
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
  };
  let context;
  try {
    context =
      input.authoredStatus === "available"
        ? available({
            selected: resolveUserDayWindowForLabel({ ...temporal, userDayDate: query.ownerDay }),
            current: resolveUserDayContainingInstant({
              ...temporal,
              instant: new Date(query.asOf),
            }),
          })
        : ({ status: input.authoredStatus, reason: "authoredAuthorityUnavailable" } as const);
  } catch {
    context = { status: "incomplete", reason: "canonicalBoundaryUnavailable" } as const;
  }
  const month =
    context.status === "available"
      ? queryMonthlyPlanner({
          displayedMonth: query.ownerDay.slice(0, 7),
          selectedLabel: query.ownerDay,
          evaluationInstant: new Date(query.asOf),
          temporal,
          planningRange: state.previewRange,
          preview: state.preview,
          manualEvents: state.manualEvents,
          currentCommitmentSources: {
            templates: state.blockTemplates,
            recurrences: state.blockRecurrences,
          },
        })
      : undefined;
  const bounds =
    context.status === "available"
      ? {
          startsAt: context.value.selected.start.toISOString(),
          endsAt: context.value.selected.end.toISOString(),
        }
      : undefined;
  const unavailableContext = {
    status: "incomplete",
    reason: "canonicalContextUnavailable",
  } as const;
  const manual =
    month?.kind === "available" && month.model.selectedDay
      ? available(
          month.model.selectedDay.occurrences
            .filter((item) => item.target.kind === "event")
            .map((item) => ({
              subject: "manualEvent" as const,
              layer: "authored" as const,
              ownerDay: query.ownerDay,
              evidence: item,
              source: state.manualEvents.find(
                (event) => item.target.kind === "event" && event.id === item.target.eventId,
              ),
              reporting: "notExecutionEvidence" as const,
            })),
        )
      : context.status === "available"
        ? unavailableContext
        : context;
  const preview = state.preview;
  const planning =
    context.status !== "available"
      ? context
      : !preview
        ? ({ status: "unavailable", reason: "noPreview" } as const)
        : query.ownerDay < preview.rangeStartDate || query.ownerDay > preview.rangeEndDate
          ? ({ status: "unavailable", reason: "outsidePreview" } as const)
          : available({
              layer: "derivedCurrentPlanning" as const,
              freshness: preview.isStale ? ("stale" as const) : ("current" as const),
              generatedAt: preview.generatedAt,
              // A past query sees explicitly CURRENT planning context, never reconstructed historical truth.
              items: [
                ...preview.result.generatedWorkBlocks.map((fact) => ({
                  subject: "work" as const,
                  fact,
                })),
                ...preview.result.scheduledBlocks
                  .filter((fact) => fact.source !== "manual")
                  .map((fact) => ({ subject: "commitment" as const, fact })),
              ]
                .flatMap(({ subject, fact }) => {
                  const full = {
                    startsAt: fact.startsAt.toISOString(),
                    endsAt: fact.endsAt.toISOString(),
                  };
                  const clipped = bounds ? visibleInterval(full, bounds) : undefined;
                  if (fact.userDayDate !== query.ownerDay && !clipped) return [];
                  const reference = fact.occurrenceIdentity
                    ? createDurableOccurrenceReference(fact.occurrenceIdentity, state)
                    : { status: "unavailable" as const };
                  return [
                    {
                      subject,
                      ownerDay: fact.userDayDate,
                      fact: structuredClone(fact),
                      reference,
                      authoritativeInterval: full,
                      visibleInterval: clipped ?? null,
                      membership:
                        fact.userDayDate === query.ownerDay
                          ? ("owned" as const)
                          : ("intersecting" as const),
                      reporting: "notPublishedEvidence" as const,
                    },
                  ];
                })
                .sort(
                  (a, b) =>
                    a.authoritativeInterval.startsAt.localeCompare(
                      b.authoritativeInterval.startsAt,
                    ) ||
                    stableKey(a.reference).localeCompare(stableKey(b.reference)) ||
                    a.fact.id.localeCompare(b.fact.id),
                ),
              attention:
                month?.kind === "available" && month.model.selectedDay
                  ? available({
                      friction: month.model.selectedDay.friction,
                      unplaced: month.model.selectedDay.unplaced,
                    })
                  : unavailableContext,
            });
  const realized =
    input.realized.status !== "available"
      ? input.realized
      : !bounds
        ? unavailableContext
        : available(
            input.realized.value
              .flatMap((fact) => {
                const clipped = visibleInterval(fact, bounds);
                if (fact.userDayDate !== query.ownerDay && !clipped) return [];
                return [
                  {
                    layer: "acceptedRealized" as const,
                    fact: structuredClone(fact),
                    ownerDay: fact.userDayDate,
                    subject: fact.scheduleRole,
                    authoritativeInterval: { startsAt: fact.startsAt, endsAt: fact.endsAt },
                    visibleInterval: clipped,
                    membership:
                      fact.userDayDate === query.ownerDay
                        ? ("owned" as const)
                        : ("intersecting" as const),
                    reporting: "requiresPublishedTarget" as const,
                  },
                ];
              })
              .sort(
                (a, b) =>
                  a.fact.startsAt.localeCompare(b.fact.startsAt) ||
                  a.fact.id.localeCompare(b.fact.id),
              ),
          );
  const published =
    input.history.status !== "available"
      ? input.history
      : available(
          input.history.value
            .filter(
              (p) => p.day.userDayDate === query.ownerDay && p.batch.publishedAt <= query.asOf,
            )
            .sort(
              (a, b) =>
                a.batch.publishedAt.localeCompare(b.batch.publishedAt) ||
                a.batch.id.localeCompare(b.batch.id),
            )
            .map((publication, index, all) => ({
              batchId: publication.batch.id,
              publishedAt: publication.batch.publishedAt,
              durability: publication.durability,
              effective: index === all.length - 1,
              frozenDay: structuredClone(publication.day),
              sleepCoverage: publication.day.sleepCoverage ?? "legacyUnavailable",
              items: publication.day.occurrences
                .map((snapshot) => {
                  const matches =
                    input.actual.status === "available"
                      ? input.actual.value.filter((item) =>
                          snapshot.version === 4
                            ? item.subject.kind === "publishedSleep" &&
                              item.subject.publicationBatchId === publication.batch.id &&
                              item.subject.snapshotId === snapshot.sleep.snapshotId
                            : item.subject.kind === "planned" &&
                              durableOccurrenceReferencesEqual(
                                item.subject.reference,
                                snapshot.reference,
                              ),
                        )
                      : undefined;
                  const report =
                    snapshot.version === 4
                      ? {
                          status: "materialized" as const,
                          target: publishedSleepExecutionTarget(snapshot),
                        }
                      : materializeHistoricalPlanExecutionTarget({
                          day: publication.day,
                          occurrence: snapshot,
                        });
                  return {
                    snapshot: structuredClone(snapshot),
                    timing: historicalOccurrenceTimingSemantics(snapshot),
                    identity: {
                      publicationBatchId: publication.batch.id,
                      reference: structuredClone(snapshot.reference),
                    },
                    actual: matches ? available(matches) : input.actual,
                    outcomeKnowledge: matches
                      ? matches.length
                        ? ("explicitRecord" as const)
                        : ("unknown" as const)
                      : ("unavailable" as const),
                    reporting:
                      input.actual.status !== "available"
                        ? {
                            status: "unavailable" as const,
                            reason: "executionAuthorityUnavailable",
                          }
                        : report.status === "materialized"
                          ? {
                              status: "targetAvailable" as const,
                              command:
                                snapshot.version === 4
                                  ? ("recordSleepExecution" as const)
                                  : ("recordExecution" as const),
                              target: report.target,
                              admission: "commandRechecksAuthority" as const,
                            }
                          : report,
                  };
                })
                .sort((a, b) => stableKey(a.identity).localeCompare(stableKey(b.identity))),
            })),
        );
  return structuredClone({
    status: "projected" as const,
    version: 1 as const,
    ownerDay: query.ownerDay,
    asOf: query.asOf,
    mode:
      context.status === "available"
        ? query.ownerDay < context.value.current.userDayDate
          ? "past"
          : query.ownerDay > context.value.current.userDayDate
            ? "future"
            : "current"
        : "unknown",
    currentCanonicalContext: context,
    authored:
      input.authoredStatus === "available"
        ? available({
            interpretation: "currentSourceContext" as const,
            schedulingPreferences: state.schedulingPreferences,
            shiftCycles: state.shiftCycles,
            shiftDefinitions: state.shiftDefinitions,
            commitmentTemplates: state.blockTemplates,
            commitmentRecurrences: state.blockRecurrences,
          })
        : { status: input.authoredStatus, reason: "authoredAuthorityUnavailable" },
    manual,
    planning,
    realized,
    sleepPlanning: input.sleep,
    publicationCoverage:
      published.status === "available"
        ? published.value.length
          ? "published"
          : "notPublished"
        : published.status,
    published,
    actual: input.actual,
    // No aggregate completeness: consumers must inspect the families required for their claim.
    completeness: "scopedByEvidenceFamily" as const,
    nextOwnerDay: addUserDayLabels(query.ownerDay, 1),
  });
}
export type SelectedDayEvidenceResult = ReturnType<typeof buildSelectedDayEvidence>;
