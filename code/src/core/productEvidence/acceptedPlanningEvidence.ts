import type { ProposalAuthorityV1 } from "../planning/proposal.js";
import type { RealizationAuthorityV1 } from "../planning/acceptedAllocationRealization.js";
import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";
import { realizedScheduleReference } from "../planning/realizedScheduleIdentity.js";
import { durableOccurrenceReferencesEqual } from "../occurrences/durableOccurrenceReference.js";
import { isCanonicalTodayEvaluationInstant } from "../today/buildTodayReadModel.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";
import {
  available,
  byIdentity,
  type Evidence,
  type HistoricalEvidence,
  type ActualEvidence,
  validOwnerDay,
  stableKey,
} from "./evidence.js";

export type AcceptedPlanningEvidenceQuery = {
  startUserDayDate: string;
  endUserDayDateExclusive: string;
  asOf: string;
  select?: { kind: "goal" | "acceptedAllocation" | "scheduledFact"; id: string };
};
export function evidenceRange(query: AcceptedPlanningEvidenceQuery) {
  if (
    !isCanonicalTodayEvaluationInstant(query.asOf) ||
    !validOwnerDay(query.startUserDayDate) ||
    !validOwnerDay(query.endUserDayDateExclusive) ||
    query.startUserDayDate >= query.endUserDayDateExclusive ||
    (query.select && !query.select.id)
  )
    return undefined;
  const days: string[] = [];
  for (
    let day = query.startUserDayDate;
    day < query.endUserDayDateExclusive;
    day = addUserDayLabels(day, 1)
  ) {
    if (days.length === 366) return undefined;
    days.push(day);
  }
  return days;
}
export type AcceptedPlanningEvidenceInput = {
  query: AcceptedPlanningEvidenceQuery;
  proposals: Evidence<ProposalAuthorityV1>;
  realizations: Evidence<RealizationAuthorityV1>;
  history: HistoricalEvidence;
  actual: ActualEvidence;
};
/** Exact stored references only. Proposal supersession is never accepted-allocation revocation. */
export function buildAcceptedPlanningEvidence(input: AcceptedPlanningEvidenceInput) {
  const { query } = input;
  const days = evidenceRange(query);
  if (!days) return { status: "invalidQuery", reason: "invalidRangeOrAsOf" } as const;
  const inRange = (day: string) =>
    day >= query.startUserDayDate && day < query.endUserDayDateExclusive;
  const proposals = input.proposals.status === "available" ? input.proposals.value : undefined;
  const authority =
    input.realizations.status === "available" ? input.realizations.value : undefined;
  const acceptedById = new Map(
    proposals?.acceptedAllocations.filter((a) => a.acceptedAt <= query.asOf).map((a) => [a.id, a]),
  );
  const realizationById = new Map(
    authority?.realizations.filter((r) => r.realizedAt <= query.asOf).map((r) => [r.id, r]),
  );
  const historicalFacts =
    input.history.status === "available"
      ? input.history.value
          .filter((p) => inRange(p.day.userDayDate) && p.batch.publishedAt <= query.asOf)
          .sort(
            (a, b) =>
              a.batch.publishedAt.localeCompare(b.batch.publishedAt) ||
              a.batch.id.localeCompare(b.batch.id) ||
              a.day.userDayDate.localeCompare(b.day.userDayDate),
          )
          .flatMap((p) =>
            p.day.occurrences.flatMap((s) =>
              s.version === 3
                ? [
                    {
                      fact: s.realizedSchedule,
                      publication: {
                        batchId: p.batch.id,
                        publishedAt: p.batch.publishedAt,
                        frozenSnapshot: s,
                        frozenDay: {
                          userDayDate: p.day.userDayDate,
                          dayBoundaryStartTime: p.day.dayBoundaryStartTime,
                          weekStartsOn: p.day.weekStartsOn,
                          utcOffsetMinutes: p.day.utcOffsetMinutes,
                        },
                      },
                    },
                  ]
                : [],
            ),
          )
      : [];
  // Older legal snapshots may retain an accepted schedule reference without the V3 frozen fact.
  // Their missing lineage is unknown, not evidence that no accepted work was published.
  const unresolvedHistorical =
    input.history.status === "available"
      ? available(
          input.history.value
            .filter((p) => inRange(p.day.userDayDate) && p.batch.publishedAt <= query.asOf)
            .flatMap((p) =>
              p.day.occurrences.flatMap((snapshot) => {
                if (
                  snapshot.version === 3 ||
                  snapshot.reference.sourceKind !== "acceptedAllocation"
                )
                  return [];
                const selected = query.select;
                if (
                  selected?.kind === "scheduledFact" &&
                  snapshot.reference.scheduledSubjectId !== selected.id
                )
                  return [];
                if (
                  selected?.kind === "acceptedAllocation" &&
                  snapshot.reference.acceptedAllocationId !== selected.id
                )
                  return [];
                // Legacy Goal labels are not the missing accepted-origin Goal/Demand chain.
                // Keep this uncertainty for Goal selectors instead of claiming scoped absence.
                return [
                  {
                    batchId: p.batch.id,
                    publishedAt: p.batch.publishedAt,
                    snapshot,
                    reason: "legacyLineageUnavailable" as const,
                  },
                ];
              }),
            )
            .sort(
              (a, b) =>
                a.publishedAt.localeCompare(b.publishedAt) ||
                a.batchId.localeCompare(b.batchId) ||
                stableKey(a.snapshot.reference).localeCompare(stableKey(b.snapshot.reference)),
            ),
        )
      : input.history;
  const hasUnknownHistorical =
    unresolvedHistorical.status === "available" && unresolvedHistorical.value.length > 0;
  const currentFacts =
    authority?.facts.filter(
      (f) => inRange(f.userDayDate) && realizationById.has(f.origin.realizationId),
    ) ?? [];
  const factById = new Map(currentFacts.map((f) => [f.id as string, f]));
  for (const { fact } of historicalFacts) if (!factById.has(fact.id)) factById.set(fact.id, fact);
  const selectFact = (fact: RealizedScheduleFactV1) =>
    !query.select || query.select.kind === "goal"
      ? !query.select || fact.lineage.goalId === query.select.id
      : query.select.kind === "acceptedAllocation"
        ? fact.origin.acceptedAllocationId === query.select.id
        : fact.id === query.select.id;
  const facts = [...factById.values()]
    .filter(selectFact)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || byIdentity(a, b))
    .map((fact) => {
      const accepted = acceptedById.get(fact.origin.acceptedAllocationId);
      const realization = realizationById.get(fact.origin.realizationId);
      const proposal = proposals?.proposals.find(
        (p) => p.id === fact.origin.proposalId && p.revision === fact.origin.proposalRevision,
      );
      const decision = proposals?.decisions.find((d) => d.id === fact.origin.proposalDecisionId);
      const claim = accepted?.claims.find((c) => c.id === fact.origin.acceptedClaimId);
      const linked =
        accepted &&
        claim &&
        realization &&
        proposal &&
        decision &&
        decision.proposalId === proposal.id &&
        decision.proposalRevision === proposal.revision &&
        realization.proposalId === fact.origin.proposalId &&
        realization.proposalRevision === fact.origin.proposalRevision &&
        realization.acceptedClaimIds.includes(fact.origin.acceptedClaimId) &&
        accepted.revision === fact.origin.acceptedAllocationRevision &&
        accepted.proposalId === fact.origin.proposalId &&
        accepted.proposalRevision === fact.origin.proposalRevision &&
        accepted.decisionId === fact.origin.proposalDecisionId &&
        realization.acceptedAllocationId === accepted.id &&
        realization.acceptedAllocationRevision === accepted.revision &&
        claim.goalId === fact.lineage.goalId &&
        claim.demandId === fact.lineage.demandId &&
        claim.demandRevision === fact.lineage.demandRevision;
      return {
        fact: structuredClone(fact),
        role: fact.scheduleRole,
        origin: structuredClone(fact.origin),
        lineage: structuredClone(fact.lineage),
        verification: linked ? ("resolved" as const) : ("retainedReferenceOnly" as const),
        accepted: accepted
          ? available({
              id: accepted.id,
              revision: accepted.revision,
              decisionId: accepted.decisionId,
              proposalId: accepted.proposalId,
              proposalRevision: accepted.proposalRevision,
              sourceOptionId: accepted.sourceOptionId,
              acceptedAt: accepted.acceptedAt,
            })
          : {
              status:
                input.proposals.status === "protected"
                  ? ("protected" as const)
                  : ("unavailable" as const),
              reason: "acceptedRecordNotReadable",
            },
        proposal: proposal
          ? available(proposalReference(proposal))
          : {
              status:
                input.proposals.status === "protected"
                  ? ("protected" as const)
                  : ("unavailable" as const),
              reason: "exactProposalRevisionNotReadable",
            },
        realization: realization
          ? available(realization)
          : {
              status:
                input.realizations.status === "protected"
                  ? ("protected" as const)
                  : ("unavailable" as const),
              reason: "realizationRecordNotReadable",
            },
        publication:
          input.history.status === "available"
            ? available(
                historicalFacts.filter((h) => h.fact.id === fact.id).map((h) => h.publication),
              )
            : input.history,
        execution:
          input.actual.status === "available"
            ? available(
                input.actual.value.filter(
                  (item) =>
                    item.subject.kind === "planned" &&
                    durableOccurrenceReferencesEqual(
                      item.subject.reference,
                      realizedScheduleReference(fact),
                    ),
                ),
              )
            : input.actual,
        progress: "notInferred" as const,
      };
    });
  const selectedFact =
    query.select?.kind === "scheduledFact" ? factById.get(query.select.id) : undefined;
  const iterations =
    input.proposals.status !== "available"
      ? input.proposals
      : available(
          [...acceptedById.values()]
            .filter((accepted) => {
              if (!accepted.claims.some((claim) => inRange(claim.userDayDate))) return false;
              if (!query.select) return true;
              if (query.select.kind === "goal")
                return accepted.claims.some((claim) => claim.goalId === query.select!.id);
              if (query.select.kind === "acceptedAllocation")
                return accepted.id === query.select.id;
              return accepted.id === selectedFact?.origin.acceptedAllocationId;
            })
            .sort(byIdentity)
            .map((accepted) => {
              const realization = [...realizationById.values()].find(
                (r) =>
                  r.acceptedAllocationId === accepted.id &&
                  r.acceptedAllocationRevision === accepted.revision,
              );
              const realizedFacts = currentFacts
                .filter((f) => f.origin.acceptedAllocationId === accepted.id)
                .sort(byIdentity);
              const exactProposal = proposals?.proposals.find(
                (p) => p.id === accepted.proposalId && p.revision === accepted.proposalRevision,
              );
              const decision = proposals?.decisions.find((d) => d.id === accepted.decisionId);
              return {
                accepted: structuredClone(accepted),
                proposal: exactProposal
                  ? available(proposalReference(exactProposal))
                  : { status: "unavailable" as const, reason: "exactProposalRevisionNotReadable" },
                decision: decision
                  ? available(decision)
                  : { status: "unavailable" as const, reason: "acceptanceDecisionNotReadable" },
                demands: [
                  ...new Map(
                    accepted.claims.map((c) => [
                      `${c.goalId}|${c.demandId}|${c.demandRevision}`,
                      {
                        goalId: c.goalId,
                        demandId: c.demandId,
                        demandRevision: c.demandRevision,
                        demandProjectionId: c.demandProjectionId,
                      },
                    ]),
                  ).values(),
                ].sort(
                  (a, b) =>
                    a.goalId.localeCompare(b.goalId) ||
                    a.demandId.localeCompare(b.demandId) ||
                    a.demandRevision - b.demandRevision,
                ),
                realization:
                  input.realizations.status !== "available"
                    ? input.realizations
                    : realization
                      ? available(realization)
                      : { status: "notApplicable" as const, reason: "acceptedButUnrealized" },
                realizationState:
                  input.realizations.status !== "available"
                    ? ("unknown" as const)
                    : realization
                      ? ("realized" as const)
                      : ("acceptedButUnrealized" as const),
                scheduledFactsInRange: realizedFacts,
                currentness: {
                  acceptedAuthority: "retained" as const,
                  supersession: "notRepresented" as const,
                  proposalLifecycle: exactProposal?.lifecycle ?? "unknown",
                  interpretation: "proposalLifecycleDoesNotRevokeAcceptance" as const,
                },
              };
            }),
        );
  return structuredClone({
    status: "projected" as const,
    version: 1 as const,
    query,
    iterations,
    unresolvedHistorical,
    facts:
      authority || input.history.status === "available"
        ? {
            ...available(facts),
            coverage:
              input.realizations.status === "available" &&
              input.history.status === "available" &&
              !hasUnknownHistorical
                ? ("complete" as const)
                : ("partial" as const),
          }
        : { status: "unavailable" as const, reason: "lineageSourcesUnavailable" },
    completeness:
      input.proposals.status === "available" &&
      input.realizations.status === "available" &&
      input.history.status === "available" &&
      input.actual.status === "available" &&
      !hasUnknownHistorical
        ? ("complete" as const)
        : ("partial" as const),
    sourceCoverage: {
      accepted: input.proposals.status,
      realization: input.realizations.status,
      historical: input.history.status,
      execution: input.actual.status,
    },
    lookup:
      facts.length || (iterations.status === "available" && iterations.value.length)
        ? "found"
        : input.proposals.status === "available" &&
            input.realizations.status === "available" &&
            input.history.status === "available" &&
            !hasUnknownHistorical
          ? "notFoundInRange"
          : "unknown",
    progress: "notInferred" as const,
  });
}
export type AcceptedPlanningEvidenceResult = ReturnType<typeof buildAcceptedPlanningEvidence>;

function proposalReference(proposal: ProposalAuthorityV1["proposals"][number]) {
  return {
    id: proposal.id,
    revision: proposal.revision,
    generatedAt: proposal.generatedAt,
    lifecycle: proposal.lifecycle,
    scope: proposal.scope,
    predecessor: proposal.predecessor,
    successor: proposal.successor,
    provenance: proposal.provenance,
  };
}
